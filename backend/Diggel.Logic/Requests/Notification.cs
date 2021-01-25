using System.Threading.Tasks;
using Citolab.Persistence;

namespace Diggel.Logic.Requests
{
    /// <summary>
    /// A command request that doesn't have a return value e.g. fire-and-forget.
    /// </summary>
    public abstract class Notification : Request
    {
        public Task Execute(IUnitOfWork unitOfWork)
        {
            UnitOfWork = unitOfWork;
            return DoExecute();
        }

        protected abstract Task DoExecute();
    }
}