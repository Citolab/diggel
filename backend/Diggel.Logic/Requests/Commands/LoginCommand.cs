using System.Threading.Tasks;
using Diggel.Logic.Models;
using Diggel.Logic.ViewModels;
using Microsoft.Extensions.Configuration;

namespace Diggel.Logic.Requests.Commands
{
    public class LoginCommand : Command<LoginResult>
    {
        private string adminUserName = string.Empty;
        private string adminUserPassword = string.Empty;
        public LoginCommand(IConfiguration configuration)
        {
            adminUserName = configuration.GetValue<string>("AppSettings:backoffice_admin_username");
            adminUserPassword = configuration.GetValue<string>("AppSettings:backoffice_admin_password");
        }
        public string Username { get; set; }
        public string Password { get; set; }

        protected override Task<LoginResult> DoExecute() => Task.Run(() =>
        {
            if (Username == adminUserName && Password == adminUserPassword)
            {
                return new LoginResult
                {
                    Success = true,
                    UserId = adminUserName,
                    FullName = string.Empty,
                    UserRole = UserRole.Supervisor
                };
            }

            return new LoginResult { Success = false };
        });
    }
}