using System;
using System.Linq;
using System.Threading.Tasks;
using Diggel.Logic.Models;
using Diggel.Logic.ViewModels;

namespace Diggel.Logic.Requests.Queries
{
    public class TestSessionQuery : Query<TestSessionViewModel>
    {
        public Guid TestSessionId { get; set; }

        protected override async Task<TestSessionViewModel> DoExecute()
        {
            if (TestSessionId == Helpers.StaticData.DemoGuid)
            {
                return Helpers.StaticData.DemoSession;
            }
            var testSessionCollection = UnitOfWork.GetCollection<TestSession>();
            var testSession = await testSessionCollection.GetAsync(TestSessionId);
            if (testSession == null)
            {
                throw new DomainException(ErrorCodes.InvalidTestSessionId, "Invalid testsessionid.", false);
            }

            var itemResponseCollection = UnitOfWork.GetCollection<ItemResult>();
            var itemResponses = itemResponseCollection.AsQueryable().Where(r => r.TestSessionId == testSession.Id)
                .ToList();
            
            return new TestSessionViewModel(testSession, itemResponses);
        }
    }
}