using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Citolab.Persistence;
using CsvHelper;
using CsvHelper.Configuration;
using Diggel.Logic.Helpers;
using Diggel.Logic.Models;
using Diggel.Logic.ViewModels;

namespace Diggel.Logic.Requests.Queries
{
    public static class CsvQueryHelper
    {
        public enum CsvExportLevel
        {
            TestSession = 0,
            CandidateSession = 1,
            All = 2
        }
        public static Dictionary<string, byte[]> CreateLogCsv(IUnitOfWork unitOfWork, CsvExportLevel exportLevel, Guid? groupId = null, string startCode = "")
        {
            var csvs = new Dictionary<string, byte[]>();

            var candidateSessionsCollection = unitOfWork.GetCollection<CandidateSessions>();
            var testSessionCollection = unitOfWork.GetCollection<TestSession>();

            var testSessionsQuery = testSessionCollection.AsQueryable();
            var candidateSessionsQuery = candidateSessionsCollection
                .AsQueryable()
                .Where(s => s.Status == TestStatus.Finished && !s.IsDemo);

            if (groupId.HasValue)
            {
                candidateSessionsQuery.Where(c => c.GroupId == groupId.Value);
                testSessionsQuery.Where(t => t.GroupId == groupId.Value);
            }
            if (!string.IsNullOrEmpty(startCode))
            {
                candidateSessionsQuery.Where(c => c.StartCode == startCode);
            }
            var candidateSessions = candidateSessionsQuery.ToList();
            var candidateSessionDictionary = candidateSessions.SelectMany(c => c.TestSessions
                .Select(t => new { TestSessionId = t, CandidateSession = c })
                )
                .ToDictionary(c => c.TestSessionId, c => c.CandidateSession);
            var sessionIds = candidateSessions.SelectMany(c => c.TestSessions).Distinct().ToHashSet();

            var testSessions = string.IsNullOrEmpty(startCode) ?
                testSessionsQuery
                     .ToList() // get from database
                     .Where(s => sessionIds.Contains(s.Id))
                     .ToList() :
                   testSessionsQuery.Where(t => sessionIds.Contains(t.Id)) // for just 1 candidate, query testsessionIds on the database
                   .ToList();
            testSessions.ToList().Sort();

            var itemResponseCollection = unitOfWork.GetCollection<ItemResult>();
            var itemLogCollection = unitOfWork.GetCollection<ItemLogRow>();

            var groupName = string.Empty;
            var allLogRowViewModels = new List<SessionLogRowViewModel>();

            foreach (var testSession in testSessions)
            {
                if (string.IsNullOrEmpty(groupName))
                {
                    groupName = testSession.GroupName;
                }
                var logRowViewModels = new List<SessionLogRowViewModel>();
                logRowViewModels.AddRange(testSession.Log.Select(l =>
                    new SessionLogRowViewModel(l, string.Empty, string.Empty, testSession.GroupName, testSession.Id)));
                var itemIndex = 1;

                var itemResponses = itemResponseCollection.AsQueryable()
                    .Where(r => r.TestSessionId == testSession.Id).ToList();
                foreach (var itemResponse in itemResponses)
                {
                    var itemLogRows = itemLogCollection.AsQueryable().Where(l =>
                        l.TestSessionId == testSession.Id && l.ItemId == itemResponse.Identifier);

                    var itemId = $"{itemIndex:0000}_{itemResponse.Identifier}";
                    foreach (var logRow in itemLogRows)
                    {
                        logRowViewModels.Add(new SessionLogRowViewModel(logRow, itemId, testSession.GroupName,
                            testSession.Id));
                    }

                    itemIndex++;
                }

                logRowViewModels.Sort();
                for (var i = 0; i < logRowViewModels.Count; i++)
                {
                    logRowViewModels[i].SequenceNumber = i + 1;
                }
                allLogRowViewModels.AddRange(logRowViewModels);
            }
            var testSessionStartCode = candidateSessions.SelectMany(c => c.TestSessions.Select(t =>
            {
                return new { id = t, startCode = c.StartCode };
            }).Distinct()).ToDictionary(c => c.id, c => c.startCode);

            var sessionsToProcessPerCsv = exportLevel switch
            {
                CsvExportLevel.All => new List<List<TestSession>> { testSessions.Select(t => t).ToList() },
                CsvExportLevel.TestSession => testSessions.Select(t => new List<TestSession> { t }).ToList(),
                CsvExportLevel.CandidateSession => candidateSessions.Select(c => testSessions.Where(t => c.TestSessions.Contains(t.Id)).ToList()).ToList(),
                _ => throw new NotImplementedException()
            };

            foreach (var sessionList in sessionsToProcessPerCsv)
            {
                var index = 0;

                using var memoryStream = new MemoryStream();
                using TextWriter textWriter = new StreamWriter(memoryStream);
                using var csvWriter = new CsvWriter(textWriter, new CsvConfiguration(CultureInfo.GetCultureInfo("nl-NL"))
                {
                    Delimiter = ";"
                });
                var headers = new List<string> {
            "groep",  "volgnr_log", "startcode", "context",
            "item", "actie", "inhoud", "timestamp" };
                foreach (var header in headers)
                {
                    csvWriter.WriteField(header);
                }
                csvWriter.NextRecord();
                foreach (var session in sessionList)
                {
                    index++;
                    foreach (var logRow in allLogRowViewModels.Where(l => l.TestSessionId == session.Id))
                    {
                        foreach (var header in headers)
                        {
                            var value = header switch
                            {
                                "groep" => new { Quote = true, Value = logRow.GroupName },
                                "volgnr_log" => new { Quote = false, Value = logRow.SequenceNumber.ToString() },
                                "startcode" => new { Quote = true, Value = testSessionStartCode[logRow.TestSessionId] },
                                "context" => new { Quote = false, Value = logRow.ItemContext },
                                "item" => new { Quote = true, Value = logRow.ItemId },
                                "actie" => new { Quote = false, Value = logRow.Action },
                                "inhoud" => new { Quote = true, Value = logRow.Content },
                                "timestamp" => new { Quote = false, Value = logRow.Timestamp.ToString("dd/MM/yyyy HH:mm:ss.fff") },
                                "" => new { Quote = true, Value = "" },
                                _ => new { Quote = true, Value = "" }
                            };
                            csvWriter.WriteField(value.Value, value.Quote);
                        }
                        csvWriter.NextRecord();
                    }
                }
                var filename = string.Empty;
                if (exportLevel == CsvExportLevel.CandidateSession)
                {
                    var candidateSession = candidateSessionDictionary[sessionList.FirstOrDefault().Id];
                    var timestampString = string.Empty;
                    timestampString = $"-{candidateSession.StartTimestamp}".Replace(":", "");
                    var fileNameSafeGroupName = Path.GetInvalidFileNameChars()
                    .Aggregate(sessionList.FirstOrDefault()?.GroupName, (current, c) => current.Replace(c, '_'));
                    filename = $"{fileNameSafeGroupName}-{index:00000}{timestampString}-{candidateSession.StartCode}.csv";
                }
                else if (exportLevel == CsvExportLevel.TestSession || (exportLevel == CsvExportLevel.All && testSessions.Count == 1))
                {
                    var candidateSession = candidateSessionDictionary[sessionList.FirstOrDefault().Id];
                    var testSession = sessionList.FirstOrDefault();
                    var timestampString = string.Empty;
                    timestampString = $"-{testSession.StartTimestamp}".Replace(":", "");
                    var fileNameSafeGroupName = Path.GetInvalidFileNameChars()
                    .Aggregate(sessionList.FirstOrDefault()?.GroupName, (current, c) => current.Replace(c, '_'));
                    filename = $"{fileNameSafeGroupName}-{index:00000}{timestampString}-{testSession.StartCode}-{candidateSession.TestSessions.IndexOf(sessionList.First().Id)}.csv";
                }
                else
                {
                    filename = $"all-logs.csv";
                }

                csvs.Add(filename, memoryStream.ToArray());
            }
            return csvs;
        }


        public static async Task WriteRowsAsync(MemoryStream memoryStream, List<CandidateSessions> candidateSessionsList, List<TestSession> testSessions, List<ItemLogRow> allRelevantLogValues, List<ItemResult> allItemsResults)
        {
            // prepare dictionaries make lookups fast.
            var testSessionDictionary = testSessions.ToDictionary(t => t.Id, t => t);
            var itemsStarted = allRelevantLogValues
                    .Where(log => log.Action == LogActions.ItemStarted)
                    .Select(log => new { Id = $"{log.TestSessionId}-{ log.ItemContext}-{log.ItemId}", Timestamp = log.Timestamp })
                    .OrderBy(log => log.Timestamp)
                    .ToList();
            // remove double values.
            itemsStarted = itemsStarted.Where(i => i == itemsStarted.FirstOrDefault(started => started.Id == i.Id)).ToList();
            var itemStartedDictionary = itemsStarted.ToDictionary(log => log.Id, log => log.Timestamp);
            var itemsCandidateUsedInternet = allRelevantLogValues
                 .Where(log => log.Action == LogActions.OpenLink)
                 .Select(log => $"{log.TestSessionId}-{log.ItemContext}-{log.ItemId}")
                 .Distinct()
                 .ToHashSet();
            var itemsThatCanContainSearchTerms = allRelevantLogValues
                 .Where(log => log.Action == LogActions.Zoekterm)
                 .Select(log => $"{log.ItemContext}-{log.ItemId}")
                 .Distinct()
                 .ToHashSet();
            var candidateSearchTerms = allRelevantLogValues
                 .Where(log => log.Action == LogActions.Zoekterm)
                 .Select(log => new
                 {
                     Key = $"{log.TestSessionId}-{log.ItemContext}-{log.ItemId}",
                     SearchTerm = log.Content
                 })
                .GroupBy(it => it.Key)
                .ToDictionary(x => x.Key, y => string.Join("##", y.Select(z => z.SearchTerm).ToArray()));

            var itemsThatCanUseInternet = allRelevantLogValues
                 .Where(log => log.Action == LogActions.OpenLink)
                 .Select(log => $"{log.ItemContext}-{log.ItemId}")
                 .Distinct()
                 .ToHashSet();
            var uniqueItems = allItemsResults
                .Select(i => $"{i.ItemContext}-{i.Identifier}")
                .Distinct()
                .ToList();

            var itemsThatHaveMultipleInterations = uniqueItems
                .Where(code => allItemsResults.Any(i =>
                $"{i.ItemContext}-{i.Identifier}" == code &&
                i.GetInteractionResults().Count > 1))
                .ToHashSet();

            await using TextWriter textWriter = new StreamWriter(memoryStream);
            await using var csvWriter = new CsvWriter(textWriter, new CsvConfiguration(CultureInfo.GetCultureInfo("nl-NL"))
            {
                Delimiter = ";"
            });
            var headers = new HashSet<string>();
            var allRows = new List<Dictionary<string, string>>();
            foreach (var candidateSessions in candidateSessionsList)
            {
                var row = new Dictionary<string, string>
                {
                    { "GroupName", candidateSessions.GroupName },
                    { "StartCode", candidateSessions.StartCode },
                    { "ModuleId", candidateSessions.TestModuleId.ToString() }
                };
                foreach (var testsessionId in candidateSessions.TestSessions)
                {
                    var seq = candidateSessions.TestSessions.IndexOf(testsessionId) + 1;
                    row.Add($"TestSession{seq}StartTimestamp", testSessionDictionary[testsessionId].StartTimestamp.ToString());
                    row.Add($"TestSession{seq}EndTimestamp", testSessionDictionary[testsessionId].LastModified.ToString());
                }
                var itemColumns = allItemsResults
                    .Where(r => candidateSessions.TestSessions.Contains(r.TestSessionId))
                     .Select(r => r.GetColumns(
                         itemStartedDictionary.ContainsKey($"{r.TestSessionId}-{ r.ItemContext}-{ r.Identifier}") ?
                         itemStartedDictionary[$"{r.TestSessionId}-{ r.ItemContext}-{ r.Identifier}"] :
                         DateTime.MinValue,
                         itemsThatCanUseInternet.Contains($"{r.ItemContext}-{r.Identifier}") ?
                         itemsCandidateUsedInternet.Contains($"{r.TestSessionId}-{ r.ItemContext}-{ r.Identifier}") : null,
                     itemsThatCanContainSearchTerms.Contains($"{r.ItemContext}-{r.Identifier}"),
                     candidateSearchTerms.ContainsKey($"{r.TestSessionId}-{ r.ItemContext}-{ r.Identifier}") ? 
                     candidateSearchTerms[ $"{r.TestSessionId}-{ r.ItemContext}-{ r.Identifier}"] : "",
                     itemsThatHaveMultipleInterations.Contains($"{ r.ItemContext}-{ r.Identifier}")))
                     .SelectMany(columnList => columnList)
                     .ToDictionary(c => c.Key, c => c.Value);
                row = row.MergeLeft(itemColumns);

                foreach (var col in row.Where(c => !headers.Contains(c.Key)))
                {
                    headers.Add(col.Key);
                }
                allRows.Add(row);
            }
            var contexts = new List<string> { "A", "B", "C", "D" };
            var sessionColumns = headers.Where(h => !contexts.Select(c => $"{c}_").ToList().Contains(h.Substring(0, 2)))
                .ToList();
            // make sure headers are sorted like this: 
            // SessionId, Groupname etc. (session columns)
            // Interaction columns (item columns) sorted by index (A_ B_ C_ D_)
            var orderedHeaders = new List<string>();
            orderedHeaders.AddRange(sessionColumns);
            foreach (var context in contexts)
            {
                orderedHeaders.AddRange(headers.Where(h => h.StartsWith($"{context}_")));
            }

            // write header
            foreach (var header in orderedHeaders)
            {
                csvWriter.WriteField(header);
            }
            csvWriter.NextRecord();
            // write rows
            foreach (var row in allRows)
            {
                foreach (var header in orderedHeaders)
                {
                    csvWriter.WriteField(row.ContainsKey(header) ? row[header] : string.Empty);
                }
                csvWriter.NextRecord();
            }
        }

    }
}