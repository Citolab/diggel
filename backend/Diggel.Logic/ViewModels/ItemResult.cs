//using System.Collections.Generic;
//using System.Linq;
//using Diggel.Logic.Models;

//namespace Diggel.Logic.ViewModels
//{
//    public class ItemResult
//    {
//        public string Id { get; set; }
//        public string Context { get; set; }
//        public List<Models.ItemResult> Responses { get; set; }
//        public List<ItemLogRow> Log { get; set; }

//        public ItemResult()
//        {
//            Responses = new List<Models.ItemResult>();
//            Log = new List<ItemLogRow>();
//        }

//        public decimal TotalScore => Responses.Sum(r => r.Score);
//    }
//}