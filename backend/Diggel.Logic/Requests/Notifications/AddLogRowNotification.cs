using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using Citolab.Persistence;
using Diggel.Logic.Models;

namespace Diggel.Logic.Requests.Notifications
{
    public class AddLogRowNotification : Notification
    {
        public string LogAction { get; set; }
        public string LogText { get; set; }

        public Guid TestSessionId { get; set; }
        public string ItemId { get; set; }

        public DateTime Timestamp { get; set; }

        protected override async Task DoExecute()
        {
            var testSessionCollection = UnitOfWork.GetCollection<TestSession>();
            var testSession = await testSessionCollection.GetAsync(TestSessionId);
           
            if (testSession == null)
            {
                throw new DomainException(ErrorCodes.InvalidTestSessionId, "Invalid testsessionid.", false);
            }
            var itemLogRowCollection = UnitOfWork.GetCollection<ItemLogRow>();

            var newLogRow = new ItemLogRow
            {
                TestSessionId = TestSessionId,
                ItemId = ItemId,
                ItemContext = testSession.Context,
                Action = LogAction,
                Content = LogText,
                Timestamp = Timestamp != DateTime.MinValue ? Timestamp : DateTime.Now
            };
            await itemLogRowCollection.AddAsync(newLogRow);

            await InspectLogRow(newLogRow, itemLogRowCollection);
        }

        /// <summary>
        /// Inspect the new log row and add extra log rows if necessary.
        /// </summary>
        /// <param name="logRow"></param>
        /// <param name="itemLog"></param>
        private async Task InspectLogRow(ItemLogRow logRow, ICollection<ItemLogRow> itemLog)
        {
            switch (logRow.Action)
            {
                case LogActions.Navigatie:
                    await ExtractAndLogSearchTerms(logRow, itemLog);
                    await ExtractAndLogMapsNavigationTerms(logRow, itemLog);
                    break;
            }
        }

        private static async Task ExtractAndLogMapsNavigationTerms(ItemLogRow logRow, ICollection<ItemLogRow> itemLog)
        {
            if (logRow.Content.Contains("/maps/dir") &&
                Uri.TryCreate(logRow.Content, UriKind.Absolute, out var uri))
            {
                var uriSegmentsList = uri.Segments.ToList();
                var startMapsRouteDestinations = uriSegmentsList.IndexOf("dir/") + 1;
                var endMapsRouteDestinations =
                    uriSegmentsList.IndexOf(uriSegmentsList.FirstOrDefault(s => s.StartsWith("@")));
                if (endMapsRouteDestinations == -1)
                {
                    return;
                }

                var destinations = uriSegmentsList.GetRange(startMapsRouteDestinations,
                    endMapsRouteDestinations - startMapsRouteDestinations).Select(d => d.TrimEnd('/')).ToList();

                if (destinations.Any())
                {
                    var newLogRow = new ItemLogRow
                    {
                        TestSessionId = logRow.TestSessionId,
                        ItemId = logRow.ItemId,
                        ItemContext = logRow.ItemContext,
                        Action = LogActions.MapsRoute,
                        Content = string.Join(",", destinations),
                        Timestamp = logRow.Timestamp
                    };
                    await itemLog.AddAsync(newLogRow);
                }
            }
        }

        private static async Task ExtractAndLogSearchTerms(ItemLogRow logRow,
            Citolab.Persistence.ICollection<ItemLogRow> itemLog)
        {
            if (logRow.Content.Contains("/search") &&
                Uri.TryCreate(logRow.Content, UriKind.Absolute, out var uri))
            {
                var queries = HttpUtility.ParseQueryString(uri.Query);
                var searchterms = queries["q"];
                if (!string.IsNullOrWhiteSpace(searchterms))
                {
                    var newlogRow = new ItemLogRow
                    {
                        TestSessionId = logRow.TestSessionId,
                        ItemId = logRow.ItemId,
                        ItemContext = logRow.ItemContext,
                        Action = LogActions.Zoekterm,
                        Content = searchterms,
                        Timestamp = logRow.Timestamp
                    };
                    await itemLog.AddAsync(newlogRow);
                }
            }
        }
    }
}