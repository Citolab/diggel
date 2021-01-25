using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Diggel.Logic.Models;

namespace Diggel.Logic.Requests.Notifications
{
    public class AddTestSessionsToGroupNotification : Notification
    {
        public Guid GroupId { get; set; }
        public int NumberOfCandidates { get; set; }
        private Dictionary<int, string[]> modules = new Dictionary<int, string[]>()
            {
                { 1, new string[] { "A", "C" } },
                { 2, new string[] { "A", "D" } },
                { 3, new string[] { "B", "C" } },
                { 4, new string[] { "B", "D" } },
                { 5, new string[] { "C", "A" } },
                { 6, new string[] { "C", "B" } },
                { 7, new string[] { "D", "A" } },
                { 8, new string[] { "D", "B" } }
            };
        protected override async Task DoExecute()
        {
            var groupCollection = UnitOfWork.GetCollection<Group>();
            var group = await groupCollection.GetAsync(GroupId);
            if (group == null)
            {
                throw new DomainException(ErrorCodes.InvalidGroupId, $"Group with id {GroupId} doesn't exist.", true);
            }

            // get existing start codes
            var candidateSessionsCollection = UnitOfWork.GetCollection<CandidateSessions>();
            var testSessionCollection = UnitOfWork.GetCollection<TestSession>();
            var existingStartCodes = candidateSessionsCollection.AsQueryable().Select(t => t.StartCode).ToList();

            var startCodes = Group.GenerateStartCodes(NumberOfCandidates, 5, existingStartCodes);
            // get the TestModuleId for last finished TestSession
            var lastStartedTestModuleId =
                candidateSessionsCollection.AsQueryable()
                    .Where(s => s.Status != TestStatus.NotStarted)
                    .OrderByDescending(s => s.Created)
                    .FirstOrDefault()?.TestModuleId;
            for (int i = 0; i < NumberOfCandidates; i++)
            {

                // determine next TestModuleId
                var nextTestModuleId = (lastStartedTestModuleId % 8 + 1) ?? 1;
                var candidateSessions = await candidateSessionsCollection.AddAsync(new CandidateSessions
                {
                    GroupId = group.Id,
                    StartCode = startCodes[i],
                    GroupName = group.Name,
                    TestModuleId = nextTestModuleId,
                    TestSessions = new List<Guid>()
                });
                lastStartedTestModuleId = nextTestModuleId;
                var newSessions = modules[nextTestModuleId].Select(context =>
                {
                    return testSessionCollection.AddAsync(new TestSession
                    {
                        TestModuleId = nextTestModuleId,
                        StartCode = startCodes[i],
                        GroupId = group.Id,
                        GroupName = group.Name,
                        Context = context,
                        CandidateSessionsId = candidateSessions.Id
                    }).Result;
                });
                candidateSessions.TestSessions = newSessions.Select(s => s.Id).ToList();
                await candidateSessionsCollection.UpdateAsync(candidateSessions);
            }

        }
    }
}