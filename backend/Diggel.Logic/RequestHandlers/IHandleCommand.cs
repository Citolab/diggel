using System.Threading.Tasks;

namespace Diggel.Logic.RequestHandlers
{
    public interface IHandleCommand<in TCommand, TResponse>
    {
        Task<TResponse> Handle(TCommand command);
    }
}