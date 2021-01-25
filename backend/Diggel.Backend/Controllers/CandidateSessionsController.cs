using Citolab.Persistence;
using Diggel.Backend.Helpers;
using Diggel.Logic;
using Diggel.Logic.RequestHandlers;
using Diggel.Logic.Requests.Commands;
using Diggel.Logic.Requests.Queries;
using Diggel.Logic.ViewModels;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Diggel.Backend.Controllers
{
    [Route("api/candidatesessions")]
    public class CandidateSessionsController : ControllerBase
    {
        private readonly QueryHandler _queryHandler;
        private readonly CommandHandler _commandHandler;
        private NotificationHandler _notificationHandler;

        public CandidateSessionsController(IUnitOfWork unitOfWork)
        {
            _queryHandler = new QueryHandler(unitOfWork);
            _commandHandler = new CommandHandler(unitOfWork);
            _notificationHandler = new NotificationHandler(unitOfWork);
        }

        [HttpPost("start")]
        [AllowAnonymous]
        public async Task<IActionResult> Start([FromBody] StartTestSessionWithStartCodeCommand command)
        {
            var testSessionViewModel = await _commandHandler.Handle(command);
            await SignIn(testSessionViewModel);
            return Ok(new
            {
                Code = testSessionViewModel.TestStatus == "Started"
                    ? SuccessCodes.StartedTestSession
                    : SuccessCodes.ResumedTestSession,
                TestSessionViewModel = testSessionViewModel,
                Message = "Successfully started or resumed test session."
            });
        }

        [HttpPost("signout")]
        public async Task<IActionResult> Signout()
        {
            await DoSignOut();
            return Ok(new { Code = SuccessCodes.StoppedTestSession, Message = "Successfully signed out." });
        }
        // TODO seperate finish and logout. Make sure that if the first session is finished the next one can be started.
        [HttpPost("finishTestSession")]
        public async Task<IActionResult> FinishTestSession()
        {
            var loggedInTestSessionId = User.GetTestSessionId();
            var command = new FinishTestSessionCommand { TestSessionId = loggedInTestSessionId };
            var finishResult = await _commandHandler.Handle(command);
    
            if (finishResult != null)
            {
                await DoSignOut();
                var testSessionViewModel = await _commandHandler.Handle(new StartTestSessionWithStartCodeCommand { StartCode = finishResult.StartCode });
                await SignIn(testSessionViewModel);
                return Ok(new { Code = SuccessCodes.StoppedTestSession, Message = "Successfully stopped test session.", TestSessionViewModel = testSessionViewModel });
            }
            else
            {
                return Ok(new { Code = SuccessCodes.StoppedTestSession, Message = "Successfully stopped test session." });
            }
        }

        private async Task SignIn(TestSessionViewModel testSessionViewModel)
        {
            var groupName = !string.IsNullOrEmpty(testSessionViewModel.GroupName) ? testSessionViewModel.GroupName : "no_group";
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name,groupName ),
                new Claim(ClaimTypes.NameIdentifier, testSessionViewModel.Id.ToString()),
                new Claim(ClaimTypes.Role, "Candidate")
            };

            var userIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(userIdentity);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);
        }

        private async Task DoSignOut()
        {
            await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }
    }
}
