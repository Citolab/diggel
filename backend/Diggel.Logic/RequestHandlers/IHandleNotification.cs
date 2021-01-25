using System.Threading.Tasks;

namespace Diggel.Logic.RequestHandlers
{
    public interface IHandleNotification<in TNotification>
    {
        Task Handle(TNotification notification);
    }
}