using Diggel.Logic.Models;
using Diggel.Logic.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Diggel.Logic.Helpers
{
    public static class Extensions
    {

        public const string START_RESPONSE = "RESPONSE_";
        public const string START_SCORE = "SCORE_";
        public const string ITEM_SCORE = "SCORE";

        public static ItemResult Init(this ItemResult itemResult, Guid testSessionId, string itemId, string interactionId, string value, int score)
        {
            itemResult = new ItemResult
            {
                TestSessionId = testSessionId,
                Identifier = itemId,
                ResponseVariables = new List<ResponseVariable> { new ResponseVariable
                    {
                        Identifier = $"{START_RESPONSE}{interactionId}",
                        CandidateResponse = new CandidateResponse {
                            Value = value
                        }
                    }
                    },
                OutcomeVariables = new List<OutcomeVariable> { new OutcomeVariable
                    {
                        Identifier = $"{START_SCORE}posttekst",
                        Value = score.ToString()
                    } }
            };
            return itemResult;
        }

        // Works in C#3/VS2008:
        // Returns a new dictionary of this ... others merged leftward.
        // Keeps the type of 'this', which must be default-instantiable.
        // Example: 
        //   result = map.MergeLeft(other1, other2, ...)
        public static T MergeLeft<T, K, V>(this T me, params IDictionary<K, V>[] others)
            where T : IDictionary<K, V>, new()
        {
            T newMap = new T();
            foreach (IDictionary<K, V> src in
                (new List<IDictionary<K, V>> { me }).Concat(others))
            {
                // ^-- echk. Not quite there type-system.
                foreach (KeyValuePair<K, V> p in src)
                {
                    newMap[p.Key] = p.Value;
                }
            }
            return newMap;
        }

        public static Dictionary<string, string> GetColumns(this ItemResult itemResult, DateTime? itemStarted, bool? usedInternet, bool hasSearchTerms, string searchTerms, bool hasMultipleInteractions)
        {
            var columns = new Dictionary<string, string>();
            columns.Add($"{itemResult.ItemContext}_{itemResult.Identifier}_start", itemStarted != null ? itemStarted.Value.ToString("dd-MM-yyyy hh:mm:ss.fff tt") : "");
            columns.Add($"{itemResult.ItemContext}_{itemResult.Identifier}_end", itemResult.LastModified.ToString("dd-MM-yyyy hh:mm:ss.fff tt"));
            columns.Add($"{itemResult.ItemContext}_{itemResult.Identifier}_duration-ms", (itemResult.LastModified - (itemStarted != null ? itemStarted.Value : DateTime.MinValue)).TotalMilliseconds.ToString());

            int.TryParse(itemResult.OutcomeVariables.Find(o => o.Identifier == ITEM_SCORE)?.Value, out var totalScore);
            if (hasMultipleInteractions)
            {
                columns.Add($"{itemResult.ItemContext}_{itemResult.Identifier}_total-score", totalScore.ToString());
            }
            if (usedInternet.HasValue)
            {
                columns.Add($"{itemResult.ItemContext}_{itemResult.Identifier}_used-internet", usedInternet.ToString());
            }
            if (hasSearchTerms)
            {
                columns.Add($"{itemResult.ItemContext}_{itemResult.Identifier}_search-terms", searchTerms);
            }
            foreach (var interactionResult in itemResult.GetInteractionResults())
            {
                var scoreVariable = $"{START_SCORE}{interactionResult.Identifier}";
                int.TryParse(itemResult.OutcomeVariables.Find(o => o.Identifier == scoreVariable)?.Value, out var score);
                columns.Add($"{itemResult.ItemContext}_{itemResult.Identifier}_{interactionResult.Identifier}-value", interactionResult.Value);
                columns.Add($"{itemResult.ItemContext}_{itemResult.Identifier}_{interactionResult.Identifier}-score", interactionResult.Score.ToString());
            }
            return columns;
        }


        public static List<InteractionResult> GetInteractionResults(this ItemResult itemResult)
        {
            var interactionList = new List<InteractionResult>();
            foreach (var responseVariable in itemResult.ResponseVariables)
            {
                if (responseVariable.Identifier.StartsWith(START_RESPONSE))
                {
                    var scoreVariable = responseVariable.Identifier.Replace(START_RESPONSE, START_SCORE);
                    int.TryParse(itemResult.OutcomeVariables.Find(o => o.Identifier == scoreVariable)?.Value, out var score);
                    interactionList.Add(new InteractionResult
                    {
                        Identifier = responseVariable.Identifier.Replace(START_RESPONSE, "").Trim('_'),
                        Score = score,
                        Value = responseVariable.CandidateResponse?.Value
                    });
                }
            }
            return interactionList;
        }
    }
}
