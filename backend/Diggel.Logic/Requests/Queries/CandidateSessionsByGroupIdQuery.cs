using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Diggel.Logic.Models;

namespace Diggel.Logic.Requests.Queries
{
    public class CandidateSessionsByGroupIdQuery : Query<IEnumerable<CandidateSessions>>
    {
        public Guid GroupId { get; set; }

        protected override async Task<IEnumerable<CandidateSessions>> DoExecute() =>
            await Task.Run(() => UnitOfWork.GetCollection<CandidateSessions>().AsQueryable()
                .Where(s => s.GroupId == GroupId)
                .AsEnumerable());
    }
}