using System;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Citolab.Persistence;
using Diggel.Logic.RequestHandlers;
using Diggel.Logic.Requests;
using Diggel.Logic.Requests.Notifications;
using Diggel.Logic.Requests.Queries;
using Diggel.Logic.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Diggel.Backend.Pages.Backoffice
{
    public class ViewGroup : PageModel
    {
        private readonly QueryHandler _queryHandler;
        private readonly NotificationHandler _notificationHandler;

        public GroupViewModel GroupViewModel { get; set; }

        [Range(1, 500, ErrorMessage = "Het aantal kandidaten moet tussen 1 en 500 liggen.")]
        [BindProperty]
        public int NumberOfCandidates { get; set; }

        public ViewGroup(IUnitOfWork unitOfWork)
        {
            _queryHandler = new QueryHandler(unitOfWork);
            _notificationHandler = new NotificationHandler(unitOfWork);
        }

        public async Task<IActionResult> OnGet(Guid id)
        {
            var group = _queryHandler.Handle(new GroupByIdQuery {GroupId = id}).Result;
            if (group == null)
            {
                return RedirectToPage("./Groups");
            }

            var candidateSessions = await _queryHandler.Handle(new CandidateSessionsByGroupIdQuery {GroupId = id});
            GroupViewModel = new GroupViewModel(group, candidateSessions);
            return Page();
        }

        public async Task<IActionResult> OnPost(Guid id)
        {
            var group = _queryHandler.Handle(new GroupByIdQuery {GroupId = id}).Result;
            if (group == null)
            {
                return RedirectToPage("./Groups");
            }

            if (NumberOfCandidates < 1)
            {
                ModelState.AddModelError("numberOfCandidates", "Het aantal moet een positief getal zijn.");
                return await OnGet(id);
            }

            var notification = new AddTestSessionsToGroupNotification
            {
                GroupId = id, NumberOfCandidates = NumberOfCandidates
            };

            await _notificationHandler.Handle(notification);

            return RedirectToPage("./ViewGroup", new {Id = id});
        }
    }
}