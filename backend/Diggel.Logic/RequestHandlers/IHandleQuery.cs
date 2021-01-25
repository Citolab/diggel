using System.Threading.Tasks;

namespace Diggel.Logic.RequestHandlers
{
    public interface IHandleQuery<in TQuery, TResponse>
    {
        Task<TResponse> Handle(TQuery query);
    }
}