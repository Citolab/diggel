using System;
using System.Linq;
using System.Threading.Tasks;
using Diggel.Logic.Models;

namespace Diggel.Logic.Requests.Commands
{
    public class FinishTestSessionResult
    {
        public Guid? NextTestSessionId { get; set; }
        public string StartCode { get; set; }
    }
    public class FinishTestSessionCommand : Command<FinishTestSessionResult>
    {
        public Guid TestSessionId { get; set; }

        protected override async Task<FinishTestSessionResult> DoExecute()
        {
            var candidateSessionsCollection = UnitOfWork.GetCollection<CandidateSessions>();
            var testSessionCollection = UnitOfWork.GetCollection<TestSession>();
            var testSession = await testSessionCollection.GetAsync(TestSessionId);
            if (testSession == null)
            {
                throw new DomainException(ErrorCodes.InvalidTestSessionId, "Invalid testsessionid.", false);
            }
            testSession.Finish();
            await testSessionCollection.UpdateAsync(testSession);

            var candidateSessions = await candidateSessionsCollection.GetAsync(testSession.CandidateSessionsId);
            if (candidateSessions.TestSessions.LastOrDefault() == testSession.Id)
            {
                candidateSessions.Status = TestStatus.Finished;
                await candidateSessionsCollection.UpdateAsync(candidateSessions);
                return null;
            } else
            {
                var currentIndex = candidateSessions.TestSessions.FindIndex(t => t == testSession.Id);
                var nextSessionId = candidateSessions.TestSessions.ElementAt(currentIndex + 1);
                return new FinishTestSessionResult() { NextTestSessionId = nextSessionId, StartCode = candidateSessions.StartCode };
            }
            
        }
    }
}