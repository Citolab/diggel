using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using Diggel.Backend.Helpers;
using Citolab.Persistence;
using Diggel.Logic;
using Diggel.Logic.RequestHandlers;
using Diggel.Logic.Requests;
using Diggel.Logic.Requests.Commands;
using Diggel.Logic.Requests.Notifications;
using Diggel.Logic.Requests.Queries;
using Diggel.Logic.ViewModels;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

#pragma warning disable 1998

namespace Diggel.Backend.Controllers
{
    [Route("api/testsession")]
    public class TestSessionController : ControllerBase
    {
        private readonly QueryHandler _queryHandler;
        private readonly CommandHandler _commandHandler;
        private NotificationHandler _notificationHandler;

        public TestSessionController(IUnitOfWork unitOfWork)
        {
            _queryHandler = new QueryHandler(unitOfWork);
            _commandHandler = new CommandHandler(unitOfWork);
            _notificationHandler = new NotificationHandler(unitOfWork);
        }

        [HttpGet("getid")]
        [AllowAnonymous]
        public async Task<IActionResult> GetLoggedInTestSessionId()
        {
            if (!User.Identity.IsAuthenticated)
            {
                return Ok(Guid.Empty);
            }

            return Ok(new {TestSessionId = User.GetTestSessionId()});
        }

        [HttpGet("{testSessionId}")]
        public async Task<IActionResult> GetById(Guid testSessionId)
        {
            var loggedInTestSessionId = User.GetTestSessionId();
            if (testSessionId != loggedInTestSessionId)
            {
                return Forbid();
            }

            var query = new TestSessionQuery {TestSessionId = testSessionId};

            return Ok(await _queryHandler.Handle(query));
        }

       

       

        [HttpPost("addResult")]
        public async Task<IActionResult> AddResponse([FromBody] AddItemResultNotification notification)
        {
            var loggedInTestSessionId = User.GetTestSessionId();
            if (notification.ItemResult?.TestSessionId != loggedInTestSessionId)
            {
                return Forbid();
            }

            await _notificationHandler.Handle(notification);
            return Ok(new {Code = SuccessCodes.ResponseSubmitted, Message = "Response submitted ok."});
        }

        [HttpPost("addlogrow")]
        public async Task<IActionResult> AddLogRow([FromBody] AddLogRowNotification notification)
        {
            var loggedInTestSessionId = User.GetTestSessionId();
            if (notification.TestSessionId != loggedInTestSessionId)
            {
                return Forbid();
            }

            await _notificationHandler.Handle(notification);
            return Ok(new {Code = SuccessCodes.LogRowAdded, Message = "Log row added ok."});
        }

    }
}