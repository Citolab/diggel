using System;
using System.Threading.Tasks;
using Diggel.Logic.ItemSpecificHelpers;
using Diggel.Logic.Models;

namespace Diggel.Logic.Requests.Notifications
{
    public class AddItemResultNotification : Notification
    {
        public ItemResult ItemResult { get; set; }

        protected override async Task DoExecute()
        {
            var testSessionCollection = UnitOfWork.GetCollection<TestSession>();
            var testSession = await testSessionCollection.GetAsync(ItemResult.TestSessionId);
            if (testSession == null)
            {
                throw new DomainException(ErrorCodes.InvalidTestSessionId, "Invalid testsessionid.", false);
            }
            var itemResponseCollection = UnitOfWork.GetCollection<ItemResult>();
            var itemResponse =
                await itemResponseCollection.FirstOrDefaultAsync(r =>
                    r.TestSessionId == ItemResult.TestSessionId &&
                    r.Identifier == ItemResult.Identifier);

            if (itemResponse == null)
            {
                await itemResponseCollection.AddAsync(ItemResult);
            }
            else
            {
                itemResponse.ResponseVariables = ItemResult.ResponseVariables;
                itemResponse.OutcomeVariables = ItemResult.OutcomeVariables;
                await itemResponseCollection.UpdateAsync(itemResponse);
            }
        }
    }
}