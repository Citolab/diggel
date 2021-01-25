using System.Threading.Tasks;
using Citolab.Persistence;
using Diggel.Logic.Requests;

namespace Diggel.Logic.RequestHandlers
{
    public class NotificationHandler : IHandleNotification<Notification>
    {
        private readonly IUnitOfWork _unitOfWork;

        public NotificationHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Task Handle(Notification notification)
        {
            return notification.Execute(_unitOfWork);
        }
    }
}