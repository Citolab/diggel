using System.Collections.Generic;
using System.Linq;
using Citolab.Persistence;
using Diggel.Logic.Models;
using Diggel.Logic.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.RazorPages;
using MongoDB.Bson;

namespace Diggel.Backend.Pages.Backoffice
{
    public class Groups : PageModel
    {
        private readonly IUnitOfWork _unitOfWork;
        public List<GroupViewModel> GroupViewModels { get; set; }

        public Groups(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public void OnGet()
        {
            var groupsCollection = _unitOfWork.GetCollection<Group>();
            var groups = groupsCollection.AsQueryable();
            var candidateSessionCollection = _unitOfWork.GetCollection<CandidateSessions>();

            GroupViewModels = new List<GroupViewModel>();

            foreach (var group in groups)
            {
                var candidateSessions = candidateSessionCollection.AsQueryable().Where(s => s.GroupId == group.Id);
                GroupViewModels.Add(new GroupViewModel(group, candidateSessions));
            }
        }
    }
}