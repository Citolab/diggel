using Citolab.Persistence;

namespace Diggel.Logic.Requests
{
    public abstract class Request
    {
        protected IUnitOfWork UnitOfWork;
    }
}