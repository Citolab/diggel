using System;
using System.Collections.Generic;
using System.Linq;
using Diggel.Logic.Models;

namespace Diggel.Logic.ViewModels
{
    public class GroupViewModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public List<CandidateSessionWithStatusViewModel> CandidateSessions { get; set; }
        public bool IsDemoGroup { get; set; }
        public DateTime TimeOfLastTestSession { get; set; }

        public GroupViewModel(Group group, IEnumerable<CandidateSessions> candidateSessionsList)
        {
            Id = group.Id;
            Name = group.Name;
            CandidateSessions = new List<CandidateSessionWithStatusViewModel>();
            IsDemoGroup = group.IsDemoGroup;
            foreach (var candidateSession in candidateSessionsList)
            {
                CandidateSessions.Add(new CandidateSessionWithStatusViewModel(candidateSession));
            }

            if (candidateSessionsList.Any())
            {
                TimeOfLastTestSession = candidateSessionsList.Max(s => s.StartTimestamp);
            }
        }
    }

    public class CandidateSessionWithStatusViewModel
    {
        public Guid Id { get; set; }
        public string StartCode { get; set; }
        public string Status { get; set; }
        public int? TestModuleId { get; set; }
        public DateTime StartTimestamp { get; set; }

        public CandidateSessionWithStatusViewModel(CandidateSessions candidateSessions)
        {
            Id = candidateSessions.Id;
            StartCode = candidateSessions.StartCode;
            Status = candidateSessions.Status.ToString();
            TestModuleId = candidateSessions.TestModuleId;
            StartTimestamp = candidateSessions.StartTimestamp;
        }
    }
}