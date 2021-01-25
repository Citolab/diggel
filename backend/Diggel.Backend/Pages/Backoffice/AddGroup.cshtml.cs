using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Citolab.Persistence;
using Diggel.Logic;
using Diggel.Logic.RequestHandlers;
using Diggel.Logic.Requests;
using Diggel.Logic.Requests.Commands;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Diggel.Backend.Pages.Backoffice
{
    public class AddGroup : PageModel
    {
        private readonly CommandHandler _commandHandler;

        [Required(ErrorMessage = "De groepnaam is verplicht.")]
        [StringLength(20, ErrorMessage = "De groepnaam mag maximaal 20 tekens bevatten.")]
        [BindProperty]
        public string Name { get; set; }

        [Range(1, 500, ErrorMessage = "Het aantal kandidaten moet tussen 1 en 500 liggen.")]
        [BindProperty]
        public int NumberOfCandidates { get; set; }

        public AddGroup(IUnitOfWork unitOfWork)
        {
            _commandHandler = new CommandHandler(unitOfWork);
        }

        public void OnGet()
        {
        }

        public async Task<IActionResult> OnPostAdd()
        {
            if (!ModelState.IsValid)
            {
                return Page();
            }

            var command = new AddGroupCommand
            {
                GroupName = Name,
                NumberOfCandidates = NumberOfCandidates
            };

            try
            {
                var group = await _commandHandler.Handle(command);
                return RedirectToPage("./ViewGroup", new {group.Id});
            }
            catch (DomainException e)
            {
                ModelState.AddModelError("Error", e.Message);
                return Page();
            }
        }
    }
}