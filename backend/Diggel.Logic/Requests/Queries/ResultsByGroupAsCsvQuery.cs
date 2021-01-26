using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CsvHelper;
using CsvHelper.Configuration;
using Diggel.Logic.Models;

namespace Diggel.Logic.Requests.Queries
{
    public class ResultsByGroupAsCsvQuery : Query<(string, byte[])>
    {
        public Guid GroupId { get; set; }
        public string Code { get; set; }

        protected override async Task<(string, byte[])> DoExecute()
        {
            var candidateSessions = new List<CandidateSessions>();
            var testSessions = new List<TestSession>();
            var testSessionCollection = UnitOfWork.GetCollection<TestSession>();
            var candidateSessionsCollection = UnitOfWork.GetCollection<CandidateSessions>();
            if (string.IsNullOrEmpty(Code))
            {
                candidateSessions = candidateSessionsCollection
                .AsQueryable()
                .Where(c => c.Status == TestStatus.Finished && c.GroupId == GroupId)
                .ToList();
                testSessions = testSessionCollection
                    .AsQueryable()
                    .Where(s => s.GroupId == GroupId)
                    .ToList();
            }
            else
            {
                candidateSessions = UnitOfWork.GetCollection<CandidateSessions>()
                .AsQueryable()
                .Where(c => c.Status == TestStatus.Finished && c.GroupId == GroupId && c.StartCode == Code)
                .ToList();
                var sessions = candidateSessions.SelectMany(s => s.TestSessions).Distinct().ToHashSet();
                testSessions = testSessionCollection
                    .AsQueryable()
                    .Where(s => sessions.Contains(s.Id))
                    .ToList();
            }
            if (testSessions.Any())
            {
                var testSessionIds = testSessions.Select(t => t.Id).ToHashSet();
                var itemResultCollection = UnitOfWork.GetCollection<ItemResult>();
                // just get all items results from the database, probably faster to filter the few unfinished items afterwards.
                var allItemsResults = itemResultCollection
                    .AsQueryable()
                    .Where(i => testSessionIds.Contains(i.TestSessionId))
                    .ToList();

                var allRelevantLogValues = UnitOfWork.GetCollection<ItemLogRow>()
                    .AsQueryable()
                    .Where(l => testSessionIds.Contains(l.TestSessionId) && l.Action == LogActions.SearchTerm || l.Action == LogActions.ItemStarted || l.Action == LogActions.OpenLink)
                    .ToList();
                await using var memoryStream = new MemoryStream();
                await CsvQueryHelper.WriteRowsAsync(memoryStream, candidateSessions, testSessions, allRelevantLogValues, allItemsResults);
                return (testSessions.FirstOrDefault().GroupName, memoryStream.ToArray());
            }
            return ("", new byte[0]);
        }
    }
}