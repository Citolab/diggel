using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Threading.Tasks;
using CsvHelper;
using CsvHelper.Configuration;
using Diggel.Logic.Models;
using Diggel.Logic.ViewModels;

namespace Diggel.Logic.Requests.Queries
{
    public class AllSessionLogsAsCsvZippedQuery : Query<byte[]>
    {
        public Guid? GroupId { get; set; }
        protected override Task<byte[]> DoExecute() => Task.Run(() =>
        {
            var csvs = CsvQueryHelper.CreateLogCsv(UnitOfWork, CsvQueryHelper.CsvExportLevel.TestSession, GroupId);
            using (var memoryStream = new MemoryStream())
            {
                using (var zipFile = new ZipArchive(memoryStream, ZipArchiveMode.Create))
                {
                    foreach (var csv in csvs)
                    {
                        var entry = zipFile.CreateEntry(csv.Key);
                        using (var streamWriter = new BinaryWriter(entry.Open()))
                        {
                            streamWriter.Write(csv.Value);
                        }
                    }
                }
                return memoryStream.ToArray();
            }
        });
    }
}