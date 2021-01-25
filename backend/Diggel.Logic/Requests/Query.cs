using System.Threading.Tasks;
using Citolab.Persistence;

namespace Diggel.Logic.Requests
{
    /// <summary>
    /// A query request.
    /// </summary>
    /// <typeparam name="TResponse"></typeparam>
    public abstract class Query<TResponse> : Request
    {
        public Task<TResponse> Execute(IUnitOfWork unitOfWork)
        {
            UnitOfWork = unitOfWork;
            return DoExecute();
        }

        protected abstract Task<TResponse> DoExecute();
    }
}