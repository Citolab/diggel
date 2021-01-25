using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using Citolab.Persistence;
using Diggel.Logic.Models;
using Diggel.Logic.Requests;
using Diggel.Logic.Requests.Queries;
using Diggel.Logic.ViewModels;

namespace Diggel.Logic.RequestHandlers
{
    public class QueryHandler : IHandleQuery<AllResultsCsvQuery, byte[]>,
        IHandleQuery<AllSessionLogsAsCsvQuery, byte[]>,
        IHandleQuery<AllSessionLogsAsCsvZippedQuery, byte[]>,
        IHandleQuery<ResultsByGroupAsCsvQuery, (string, byte[])>,
        IHandleQuery<SessionLogsByGroupAsCsvQuery, (string, byte[])>,
        IHandleQuery<TestSessionQuery, TestSessionViewModel>,
        IHandleQuery<GroupByIdQuery, Group>,
        IHandleQuery<CandidateSessionsByGroupIdQuery, IEnumerable<CandidateSessions>>
    {
        private readonly IUnitOfWork _unitOfWork;

        public QueryHandler(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public Task<byte[]> Handle(AllResultsCsvQuery query)
        {
            return query.Execute(_unitOfWork);
        }

        public Task<byte[]> Handle(AllSessionLogsAsCsvQuery query)
        {
            return query.Execute(_unitOfWork);
        }

        public Task<byte[]> Handle(AllSessionLogsAsCsvZippedQuery query)
        {
            return query.Execute(_unitOfWork);
        }

        public Task<(string, byte[])> Handle(ResultsByGroupAsCsvQuery query)
        {
            return query.Execute(_unitOfWork);
        }

        public Task<(string, byte[])> Handle(SessionLogsByGroupAsCsvQuery query)
        {
            return query.Execute(_unitOfWork);
        }

        public Task<TestSessionViewModel> Handle(TestSessionQuery query)
        {
            return query.Execute(_unitOfWork);
        }

        public Task<Group> Handle(GroupByIdQuery query)
        {
            return query.Execute(_unitOfWork);
        }

        public Task<IEnumerable<CandidateSessions>> Handle(CandidateSessionsByGroupIdQuery query)
        {
            return query.Execute(_unitOfWork);
        }
    }
}