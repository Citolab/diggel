using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Citolab.Persistence;
using Diggel.Logic.RequestHandlers;
using Diggel.Logic.Requests;
using Diggel.Logic.Requests.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Diggel.Backend.Controllers
{
    [Route("report")]
    [Authorize(Roles = "Supervisor")]
    public class ReportController : ControllerBase
    {
        //private readonly IUnitOfWork _unitOfWork;
        private readonly QueryHandler _queryHandler;

        public ReportController(IUnitOfWork unitOfWork)
        {
            //_unitOfWork = unitOfWork;
            _queryHandler = new QueryHandler(unitOfWork);
        }

        [HttpGet("allresults")]
        public async Task<IActionResult> GetAllResults()
        {
            var query = new AllResultsCsvQuery();
            var csvBytes = await _queryHandler.Handle(query);
            var timestamp = $"{DateTime.Now:s}".Replace(":", "");
            return new FileStreamResult(new MemoryStream(csvBytes), "text/csv")
            {
                FileDownloadName = $"allresults-{timestamp}.csv"
            };
        }

        [HttpGet("results/{groupId}")]
        public async Task<IActionResult> GetResultsByGroupId(Guid groupId)
        {
            var query = new ResultsByGroupAsCsvQuery {GroupId = groupId};
            var (groupName, csvBytes) = await _queryHandler.Handle(query);
            var fileNameSafeGroupName = Path.GetInvalidFileNameChars()
                .Aggregate(groupName, (current, c) => current.Replace(c, '_'));
            var timestamp = $"{DateTime.Now:s}".Replace(":", "");
            return new FileStreamResult(new MemoryStream(csvBytes), "text/csv")
            {
                FileDownloadName = $"results-{fileNameSafeGroupName}-{timestamp}.csv"
            };
        }

        [HttpGet("resultsByCode/{code}")]
        public async Task<IActionResult> GetResultsByCode(string code)
        {
            var query = new ResultsByGroupAsCsvQuery {Code = code};
            var (groupName, csvBytes) = await _queryHandler.Handle(query);
            var fileNameSafeGroupName = Path.GetInvalidFileNameChars()
                .Aggregate(groupName, (current, c) => current.Replace(c, '_'));
            var timestamp = $"{DateTime.Now:s}".Replace(":", "");
            if (csvBytes != null)
            {
                return new FileStreamResult(new MemoryStream(csvBytes), "text/csv")
                {
                    FileDownloadName = $"results-{fileNameSafeGroupName}-{timestamp}.csv"
                };
            }

            return NotFound();
        }

        [HttpGet("sessionlogs/{groupId}")]
        public async Task<IActionResult> GetSessionLogsByGroupId(Guid groupId)
        {
            var query = new SessionLogsByGroupAsCsvQuery {GroupId = groupId};
            var (groupName, csvBytes) = await _queryHandler.Handle(query);
            var fileNameSafeGroupName = Path.GetInvalidFileNameChars()
                .Aggregate(groupName, (current, c) => current.Replace(c, '_'));
            var timestamp = $"{DateTime.Now:s}".Replace(":", "");
            return new FileStreamResult(new MemoryStream(csvBytes), "text/csv")
            {
                FileDownloadName = $"sessionlogs-{fileNameSafeGroupName}-{timestamp}.csv"
            };
        }

        [HttpGet("allsessionlogszipped")]
        public async Task<IActionResult> GetAllSessionLogsZipped()
        {
            var query = new AllSessionLogsAsCsvZippedQuery();
            var zipBytes = await _queryHandler.Handle(query);
            var timestamp = $"{DateTime.Now:s}".Replace(":", "");
            return new FileStreamResult(new MemoryStream(zipBytes), "application/x-zip-compressed")
            {
                FileDownloadName = $"allsessionlogs-{timestamp}.zip"
            };
        }

        [HttpGet("sessionlogszipped/{groupId}")]
        public async Task<IActionResult> GetZippedSessionLogsByGroupId(Guid groupId)
        {
            var queryGroup = new GroupByIdQuery() { GroupId = groupId };
            var query = new AllSessionLogsAsCsvZippedQuery() {  GroupId = groupId};
            var group = await _queryHandler.Handle(queryGroup);
            var zipBytes = await _queryHandler.Handle(query);
            var timestamp = $"{DateTime.Now:s}".Replace(":", "");
            return new FileStreamResult(new MemoryStream(zipBytes), "application/x-zip-compressed")
            {
                FileDownloadName = $"group_${group?.Name}_sessionlogs-{timestamp}.zip"
            };
        }

        [HttpGet("allsessionlogscsv")]
        public async Task<IActionResult> GetAllSessionLogsCsv()
        {
            var query = new AllSessionLogsAsCsvQuery();
            var csvBytes = await _queryHandler.Handle(query);
            var timestamp = $"{DateTime.Now:s}".Replace(":", "");
            return new FileStreamResult(new MemoryStream(csvBytes), "text/csv")
            {
                FileDownloadName = $"allsessionlogs-{timestamp}.csv"
            };
        }

        [HttpGet("sessionlogscsvbycode/{code}")]
        public async Task<IActionResult> GetSessionLogsByCode(string code)
        {
            var query = new AllSessionLogsAsCsvQuery {FilterByCode = code};
            var csvBytes = await _queryHandler.Handle(query);
            var timestamp = $"{DateTime.Now:s}".Replace(":", "");
            return new FileStreamResult(new MemoryStream(csvBytes), "text/csv")
            {
                FileDownloadName = $"sessionlogs-{timestamp}.csv"
            };
        }
    }
}