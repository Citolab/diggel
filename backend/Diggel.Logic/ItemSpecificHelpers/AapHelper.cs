using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Diggel.Logic.Helpers;
using Diggel.Logic.Models;
using NinjaNye.SearchExtensions.Levenshtein;

// ReSharper disable StringLiteralTypo
namespace Diggel.Logic.ItemSpecificHelpers
{
    public class AapHelper
    {
        private static readonly List<string> CorrectAnswers = new List<string>
        {
            "oeakari", "uakari", "uacari" //,"cacajao calvus"
        };

        private static readonly List<string> CorrectAnswersFrontend = new List<string>
        {
            "oeakari",
            "oekari",
            "oeakarie",
            "oekarie",
            "oewakari",
            "oewkari",
            "oewakarie",
            "oewkarie",
            "oeqkari",
            "oeskari",
            "oexkari",
            "oezkari",
            "oeqkarie",
            "oeskarie",
            "oexkarie",
            "oezkarie",
            "oealari",
            "oeajari",
            "oeaiari",
            "oeamari",
            "oelari",
            "oeiari",
            "oejari",
            "oemari",

            "uakari",
            "ukari",
            "uakarie",
            "ukari",

            "uacari",
            "ucari",
            "uacarie",
            "ucari",

            "cacajao calvus",
            "cacajo calvus",
            "cacajacalvus",
            "cajao calvus",
            "cacao calvus"
        };

        public static async Task CheckOeakariAndLogLevenshteinDistances(ItemResult response,
            Citolab.Persistence.ICollection<ItemLogRow> itemLog)
        {
            //if (response.ItemId.ToLower().Contains("aap"))
            //{
            //    var responseText = response.Value;
            //    var minimumDistances = new Dictionary<string, List<ILevenshteinDistance<string>>>();
            //    foreach (var correctAnswer in CorrectAnswers)
            //    {
            //        var distances = responseText.Words().LevenshteinDistanceOf(x => x)
            //            .ComparedTo(correctAnswer).ToList();
            //        if (distances.Any())
            //        {
            //            var localMinimumDistance = distances.Min(d => d.Distance);
            //            var localMinima = distances.Where(d => d.Distance == localMinimumDistance).ToList();
            //            minimumDistances.Add(correctAnswer, localMinima);
            //        }
            //        //minimumDistances.AddRange(localMinima);
            //    }

            //    //var minimumDistance = minimumDistances.Min(d => d.Distance);
            //    //var overallMinima = minimumDistances.Where(d => d.Distance == minimumDistance);
            //    //var logString = string.Join(",", overallMinima.Select(m => $"{m.Item}:{m.Distance}"));

            //    var logString = string.Join(",", minimumDistances.Select((kvp, v) =>
            //        $"{kvp.Key}:({string.Join(",", kvp.Value.Select(d => $"{d.Item}:{d.Distance}"))})"));

            //    await itemLog.AddAsync(new ItemLogRow
            //    {
            //        TestSessionId = response.TestSessionId,
            //        ItemId = response.ItemId,
            //        ItemContext = response.ItemContext,
            //        Action = LogActions.Levenshtein,
            //        Content = logString,
            //        Timestamp = DateTime.UtcNow
            //    });
            //}
        }
    }
}