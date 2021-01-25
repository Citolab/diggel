using System;
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
    public class SessionLogsByGroupAsCsvQuery : Query<(string, byte[])>
    {
        public Guid GroupId { get; set; }

        protected override async Task<(string, byte[])> DoExecute()
        {
            var groupName = (await UnitOfWork.GetCollection<Group>().GetAsync(GroupId))?.Name;
           var result =  CsvQueryHelper.CreateLogCsv(UnitOfWork, CsvQueryHelper.CsvExportLevel.All, GroupId);
            return (groupName, result.Values.FirstOrDefault());
        }
    }
}