using System;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Text.Json;
using System.Threading.Tasks;
using Citolab.Persistence;
using Diggel.Backend.Helpers;
using Citolab.Persistence.Extensions;
using Diggel.Logic.Helpers;
using Diggel.Logic.Models;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Diggel.Logic.Seeding;
using Microsoft.Extensions.Options;

namespace Diggel.Backend
{
    public static class BackofficeSettings
    {
        public static string Environment;
    }

    public class Startup
    {
        private readonly IConfiguration _configuration;

        public Startup(IConfiguration configuration, IWebHostEnvironment hostingEnvironment)
        {
            // if (hostingEnvironment.IsDevelopment())
            // {
            //     //builder.AddApplicationInsightsSettings(developerMode: true);
            // }

            BackofficeSettings.Environment = hostingEnvironment.EnvironmentName;

            _configuration = configuration;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            AddControllerStuff(services);
            AddAuth(services);
            AddSwagger(services);
            AddPersistence(services);
            AddBusinessLogic(services);

            // services.AddSingleton<IConfigureOptions<MvcJsonOptions>, JsonOptionsSetup>();

            // Misc          
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
        }

        private void AddControllerStuff(IServiceCollection services)
        {
            services.AddRazorPages()
                .AddRazorPagesOptions(options =>
                {
                    options.Conventions.AuthorizeFolder("/Backoffice", "SupervisorPolicy");
                });
            services.AddCors();
            services.AddResponseCompression();
            services.AddLogging(builder =>
            {
                builder.AddConfiguration(_configuration.GetSection("Logging"));
                builder.AddConsole();
                builder.AddDebug();
            });

            services.AddControllers(options => { options.Filters.Add(typeof(DomainExceptionFilter)); })
                .AddJsonOptions(options =>
                {
                    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
                });
            //services.AddSpaStaticFiles(configuration => { configuration.RootPath = "wwwroot"; });
        }

        private void AddAuth(IServiceCollection services)
        {
            services.AddAuthorization(options =>
            {
                options.AddPolicy("SupervisorPolicy",
                    new AuthorizationPolicyBuilder(CookieAuthenticationDefaults.AuthenticationScheme)
                        .RequireAuthenticatedUser().RequireRole("Supervisor").Build());
                options.DefaultPolicy =
                    new AuthorizationPolicyBuilder(CookieAuthenticationDefaults.AuthenticationScheme)
                        .RequireAuthenticatedUser().Build();
            });

            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(
                options =>
                {
                    options.Cookie.Name = "diggelkoekie";
                    options.LoginPath = new PathString("/swagger");
                    options.Events.OnRedirectToLogin = context =>
                    {
                        context.Response.StatusCode = StatusCodes.Status403Forbidden;
                        return Task.CompletedTask;
                    };
                });
        }

        private void AddPersistence(IServiceCollection services)
        {
            var database = _configuration.GetValue<string>("AppSettings:database");
            if (database.Equals("mongo", StringComparison.OrdinalIgnoreCase))
            {
                services.AddMongoDbPersistence("Diggel2", _configuration.GetConnectionString("MongoDB"));
            }
            else if (database.Equals("memory", StringComparison.OrdinalIgnoreCase))
            {
                services.AddInMemoryPersistence();
            }
            else
            {
                throw new Exception("Unknown database type define in AppSettings:database");
            }
        }

        private void AddBusinessLogic(IServiceCollection services)
        {
            services.AddRequests(Assembly.Load("Diggel.Logic"));
        }

        private void AddSwagger(IServiceCollection services)
        {
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo {Title = "Diggel2 backend", Version = "v1"});
                // Set the comments path for the Swagger JSON and UI.
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                options.IncludeXmlComments(xmlPath);
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");

                app.UseHsts();
            }

            app.UseStatusCodePagesWithRedirects("/Backoffice/Index?NoAccess=True");
            app.UseResponseCompression();
            app.UseHttpsRedirection();
            var defaultFilesOptions = new DefaultFilesOptions();
            defaultFilesOptions.DefaultFileNames.Clear();
            defaultFilesOptions.DefaultFileNames.Add("index.html");
            defaultFilesOptions.DefaultFileNames.Add("index.htm");
            app.UseDefaultFiles(defaultFilesOptions);
            app.UseStaticFiles(); // For the wwwroot folder

            //Authorization needs the route to be resolved first to decide which authorization policy applies.
            app.UseRouting();
            app.UseCors(builder =>
            {
                var corsAllowedOrigins = _configuration.GetValue<string>("AppSettings:corsAllowedOrigins")?.Split(',');
                builder.WithOrigins(corsAllowedOrigins)
                    .AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials();
            });
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapRazorPages();
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller}/{action=Index}/{id?}");
                endpoints.MapControllers().RequireAuthorization();
            });

            app.UseSwagger();
            app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "Diggel2 Backend V1"); });


            var provider = new FileExtensionContentTypeProvider
            {
                Mappings = {[".apk"] = "application/vnd.android.package-archive"}
            };
            var apkDirectory = Path.Combine(Directory.GetCurrentDirectory(), "remote_server_apk");
            if (Directory.Exists(apkDirectory))
            {
                app.UseStaticFiles(new StaticFileOptions
                {
                    FileProvider = new PhysicalFileProvider(
                        Path.Combine(Directory.GetCurrentDirectory(), "remote_server_apk")),
                    RequestPath = "/remote_server_apk",
                    ContentTypeProvider = provider
                });
            }
            // Seed the demo test data if not present
            SeedDemoTestData(app);
        }

        private static void SeedDemoTestData(IApplicationBuilder app)
        {
            var unitOfWork = app.ApplicationServices.GetService<IUnitOfWork>();
            var loggerFactory = app.ApplicationServices.GetService<ILoggerFactory>();
            var seeder = new TestSeeder(unitOfWork, loggerFactory);
            seeder.SeedDemoTestSet();
        }
    }
}