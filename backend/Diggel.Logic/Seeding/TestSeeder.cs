using System;
using System.Threading.Tasks;
using Citolab.Persistence;
using Diggel.Logic.Models;
using Microsoft.Extensions.Logging;

namespace Diggel.Logic.Seeding
{
    public class TestSeeder
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ILogger _logger;

        public TestSeeder(IUnitOfWork unitOfWork, ILoggerFactory loggerFactory)
        {
            _unitOfWork = unitOfWork;
            _logger = loggerFactory.CreateLogger<TestSeeder>();
        }

        public void SeedDemoTestSet()
        {
            _logger.LogInformation("Seeding demo test set..");
            var candidateSessionsCollection = _unitOfWork.GetCollection<CandidateSessions>();
            if (candidateSessionsCollection.FirstOrDefaultAsync(c => c.StartCode == "55555").Result == null)
            {
                var candidateSession = new CandidateSessions
                {
                    StartCode = "55555",
                    IsDemo = true
                };
                candidateSessionsCollection.AddAsync(candidateSession).Wait();
            }

    
        }

        public void SeedUnitTestSet()
        {
            // TODO candidatesessions should be added.
            _logger.LogInformation("Seeding unit test set..");
            var candidateSessionsCollection = _unitOfWork.GetCollection<CandidateSessions>();
            var testSessionCollection = _unitOfWork.GetCollection<TestSession>();
            var groupCollection = _unitOfWork.GetCollection<Group>();
            var itemResponseCollection = _unitOfWork.GetCollection<ItemResult>();
            var itemLogCollection = _unitOfWork.GetCollection<ItemLogRow>();

            var groups = SeedGroups.GetGroups();
            var testData = SeedTestSessions.GetTestSessions();

            groups.ForEach(g => groupCollection.AddAsync(g).Wait());

            foreach(var t in testData.testSessions)
            {
                var candidateSession =  candidateSessionsCollection.AddAsync(new CandidateSessions
                {
                    Id = Guid.NewGuid(),
                    GroupName = t.GroupName,
                    StartCode = t.StartCode,
                    TestModuleId = 1,
                    Status = t.Status,
                    TestSessions = new System.Collections.Generic.List<System.Guid> { t.Id }
                }).Result;
                t.CandidateSessionsId = candidateSession.Id;
                testSessionCollection.AddAsync(t).Wait();
            };
            testData.itemResponses.ForEach(r => itemResponseCollection.AddAsync(r).Wait());
            testData.itemLogRows.ForEach(l => itemLogCollection.AddAsync(l).Wait());
            
            _logger.LogInformation("Done seeding unit test set.");
        }
    }
}