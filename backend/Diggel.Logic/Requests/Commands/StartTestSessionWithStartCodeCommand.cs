using System;
using System.Linq;
using System.Threading.Tasks;
using Diggel.Logic.Models;
using Diggel.Logic.ViewModels;

namespace Diggel.Logic.Requests.Commands
{
    public class StartTestSessionWithStartCodeCommand : Command<TestSessionViewModel>
    {
        public string StartCode { get; set; }

        protected override async Task<TestSessionViewModel> DoExecute()
        {
            TestSession testSession = null;
            var candidateSessionsCollection = UnitOfWork.GetCollection<CandidateSessions>();
            var testSessionCollection = UnitOfWork.GetCollection<TestSession>();

            var candidateSessions =
                await candidateSessionsCollection.FirstOrDefaultAsync(t =>
                    t.StartCode == StartCode && t.Status != TestStatus.Finished);

            if (candidateSessions == null)
            {
                throw new DomainException(ErrorCodes.InvalidStartCode,
                    "Invalid startcode or test session has finished.", true);
            }
            if (candidateSessions.IsDemo)
            {
                return Helpers.StaticData.DemoSession;
            }
            foreach (var testSessionId in candidateSessions.TestSessions)
            {
                testSession = await testSessionCollection.GetAsync(testSessionId);
                if (testSession.Status != TestStatus.Finished)
                {
                    testSession.Start();
                    await testSessionCollection.UpdateAsync(testSession);
                    if (candidateSessions.StartTimestamp == DateTime.MinValue)
                    {
                        candidateSessions.StartTimestamp = testSession.StartTimestamp;
                    }
                    candidateSessions.Status = testSession.Status;
                    await candidateSessionsCollection.UpdateAsync(candidateSessions);
                    break;
                }
            }
            var itemResponseCollection = UnitOfWork.GetCollection<Models.ItemResult>();
            if (testSession != null)
            {
                var itemResponses = itemResponseCollection.AsQueryable().Where(r => r.TestSessionId == testSession.Id)
               .ToList();

                return new TestSessionViewModel(testSession, itemResponses);
            }
            else
            {
                throw new DomainException(ErrorCodes.CantStart,
                   "Cannot find session to start.", true);
            }

        }
    }
}