using System.Threading.Tasks;
using Diggel.Logic.Models;
using Diggel.Logic.RequestHandlers;
using Diggel.Logic.Requests.Notifications;

namespace Diggel.Logic.Requests.Commands
{
    public class AddGroupCommand : Command<Group>
    {
        public string GroupName { get; set; }
        public int NumberOfCandidates { get; set; }

        protected override async Task<Group> DoExecute()
        {
            var groupCollection = UnitOfWork.GetCollection<Group>();
            var group = await groupCollection.FirstOrDefaultAsync(g => g.Name == GroupName);
            if (group != null)
            {
                throw new DomainException(ErrorCodes.GroupNameTaken, $"Group with name '{GroupName}' already exists.",
                    true);
            }

            group = new Group {Name = GroupName};
            await groupCollection.AddAsync(group);

            var notification = new AddTestSessionsToGroupNotification
            {
                GroupId = group.Id,
                NumberOfCandidates = NumberOfCandidates
            };
            
            var notificationHandler = new NotificationHandler(UnitOfWork);
            await notificationHandler.Handle(notification);

            return group;
        }
    }
}