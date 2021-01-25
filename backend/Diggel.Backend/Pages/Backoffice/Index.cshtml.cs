using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Threading.Tasks;
using Citolab.Persistence;
using Diggel.Logic.Models;
using Diggel.Logic.RequestHandlers;
using Diggel.Logic.Requests;
using Diggel.Logic.Requests.Commands;
using Diggel.Logic.ViewModels;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Diggel.Backend.Pages.Backoffice
{
    [AllowAnonymous]
    public class IndexModel : PageModel
    {
        [BindProperty] public bool NoAccess { get; set; }

        [Required(ErrorMessage = "De gebruikersnaam is verplicht.")]
        [BindProperty]
        public string Username { get; set; }

        [Required(ErrorMessage = "Het wachtwoord is verplicht.")]
        [DataType(DataType.Password)]
        [BindProperty]
        public string Password { get; set; }

        [BindProperty] public bool LoginFailure { get; set; }

        private readonly CommandHandler _commandHandler;

        public IndexModel(IUnitOfWork unitOfWork)
        {
            _commandHandler = new CommandHandler(unitOfWork);
        }

        public IActionResult OnGet(bool noAccess, bool loginFailure)
        {
            NoAccess = noAccess;
            LoginFailure = loginFailure;
            return Page();
        }

        public async Task<IActionResult> OnPostSignIn()
        {
            var command = new LoginCommand {Username = Username, Password = Password};
            var loginResult = await _commandHandler.Handle(command);
            if (loginResult.Success)
            {
                await SignIn(loginResult);
                return RedirectToPage("./Index");
            }

            LoginFailure = true;
            return Page();
            //return RedirectToPage("./Index?LoginFailure=true");
        }

        public async Task<IActionResult> OnGetSignOut()
        {
            await SignOut();
            return RedirectToPage("./Index");
        }

        private async Task SignIn(LoginResult loginResult)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, loginResult.FullName),
                new Claim(ClaimTypes.NameIdentifier, loginResult.UserId),
                new Claim(ClaimTypes.Role, UserRole.Supervisor.ToString())
            };

            var userIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(userIdentity);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);
        }

        private async Task SignOut()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }
    }
}