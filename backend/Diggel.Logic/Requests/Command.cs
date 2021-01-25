using System.Threading.Tasks;
using Citolab.Persistence;

namespace Diggel.Logic.Requests
{
    /// <summary>
    /// A command request.
    /// </summary>
    /// <typeparam name="TResponse"></typeparam>
    public abstract class Command<TResponse> : Request
    {
        public Task<TResponse> Execute(IUnitOfWork unitOfWork)
        {
            UnitOfWork = unitOfWork;
            return DoExecute();
        }

        protected abstract Task<TResponse> DoExecute();
    }
}