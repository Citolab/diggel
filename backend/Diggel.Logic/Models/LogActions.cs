using System.Dynamic;

namespace Diggel.Logic.Models
{
    public struct LogActions
    {
        public const string Zoekterm = "zoekterm";
        public const string OpenLink = "hyperlink_openen";
        public const string MapsRoute = "mapsroute";
        public const string Navigatie = "navigatie";
        public const string KeyLog = "tekst_invoer";
        public const string Paste = "plakken";
        public const string Klik = "klik";
        public const string SelecteerAntwoord = "selecteer_antwoord";
        public const string DeselecteerAntwoord = "deselecteer_antwoord";
        public const string KlikAdvertentie = "klik_advertentie";
        public const string SessionStarted = "sessie_start";
        public const string SessionResumed = "sessie_hervat";
        public const string SessionFinished = "sessie_einde";
        public const string ItemStarted = "item_start";
        public const string Geannuleerd = "geannuleerd";
        public const string Bevestigd = "bevestigd";
        public const string Levenshtein = "levenshtein";
    }
}