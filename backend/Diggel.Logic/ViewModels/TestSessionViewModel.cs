using System;
using System.Collections.Generic;
using System.Linq;
using Diggel.Logic.Models;

namespace Diggel.Logic.ViewModels
{

    public class TestSessionViewModel
    {
        public Guid Id { get; set; }
        public string TestStatus { get; set; }
        public int? TestModuleId { get; set; }
        public string GroupName { get; set; }
        public string StartCode { get; set; }
        public int CurrentItemIndex { get; set; }
        public string Context { get; set; }
        public bool IsDemoTestSession { get; set; }
        public List<ItemResult> ItemResults { get; set; }
        public TestSessionViewModel() { }
        public TestSessionViewModel(TestSession testSession, List<ItemResult> itemResults)
        {
            Id = testSession.Id;
            TestStatus = testSession.Status.ToString();
            TestModuleId = testSession.TestModuleId;
            GroupName = testSession.GroupName;
            ItemResults = itemResults;
            Context = testSession.Context;
            StartCode = testSession.StartCode;
        }
    }
}