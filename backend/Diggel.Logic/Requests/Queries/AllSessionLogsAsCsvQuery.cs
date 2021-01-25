using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using CsvHelper;
using CsvHelper.Configuration;
using Diggel.Logic.Models;
using Diggel.Logic.ViewModels;

namespace Diggel.Logic.Requests.Queries
{
    public class AllSessionLogsAsCsvQuery : Query<byte[]>
    {
        public string FilterByCode { get; set; }
        protected override Task<byte[]> DoExecute() => Task.Run(() =>
        {
            var csvDictionary = CsvQueryHelper.CreateLogCsv(UnitOfWork, CsvQueryHelper.CsvExportLevel.All, startCode: FilterByCode);
            return csvDictionary.Values.FirstOrDefault();
        });
    }
}