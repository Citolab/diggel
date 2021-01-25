using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CsvHelper;
using CsvHelper.Configuration;
using Diggel.Logic.Helpers;
using Diggel.Logic.Models;
using Diggel.Logic.ViewModels;

namespace Diggel.Logic.Requests.Queries
{
    public class AllResultsCsvQuery : Query<byte[]>
    {
        protected override async Task<byte[]> DoExecute()
        {
            // get all finished test sessions
            var testSessionCollection = UnitOfWork.GetCollection<TestSession>();
            var candidateSessionsCollection = UnitOfWork.GetCollection<CandidateSessions>();
            // get all testSessions
            var testSessions = testSessionCollection
                .AsQueryable()
                .Where(s => s.Status == TestStatus.Finished)
                .ToList();

            var candidateSessions = candidateSessionsCollection
                .AsQueryable()
                .Where(s => s.Status == TestStatus.Finished)
                .ToList();

            var itemResultCollection = UnitOfWork.GetCollection<ItemResult>();
            // just get all items results from the database, probably faster to filter the few unfinished items afterwards.
            var allItemsResults = itemResultCollection
                .AsQueryable()
                .ToList();

            var allRelevantLogValues = UnitOfWork.GetCollection<ItemLogRow>()
                .AsQueryable()
                .Where(l => l.Action == LogActions.Zoekterm || l.Action == LogActions.ItemStarted || l.Action == LogActions.OpenLink)
                .ToList();
            await using var memoryStream = new MemoryStream();
            await CsvQueryHelper.WriteRowsAsync(memoryStream, candidateSessions, testSessions, allRelevantLogValues, allItemsResults);
            return memoryStream.ToArray();
        }
    }
}