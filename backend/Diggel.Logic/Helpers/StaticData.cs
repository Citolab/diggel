using Diggel.Logic.Models;
using Diggel.Logic.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Diggel.Logic.Helpers
{
    public static class StaticData
    {
        public static Guid DemoGuid = Guid.Parse("ec57d379-75a5-460b-9aa4-266beef71ddb");

        public static TestSessionViewModel DemoSession = new TestSessionViewModel
        {
            Id = DemoGuid,
            GroupName = "GROEP TEST",
            ItemResults = new List<ItemResult>(),
            IsDemoTestSession = true,
            Context = "A",
            TestModuleId = 1
        };
    }
}
