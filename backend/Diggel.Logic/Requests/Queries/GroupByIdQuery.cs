using System;
using System.Threading.Tasks;
using Diggel.Logic.Models;

namespace Diggel.Logic.Requests.Queries
{
    public class GroupByIdQuery : Query<Group>
    {
        public Guid GroupId { get; set; }

        protected override async Task<Group> DoExecute()
        {
            return await UnitOfWork.GetCollection<Group>().GetAsync(GroupId);
        }
    }
}