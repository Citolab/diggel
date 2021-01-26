using System.Dynamic;

namespace Diggel.Logic.Models
{
    public struct LogActions
    {
        public const string SearchTerm = "search_term";
        public const string Filter = "filter";
        public const string Navigation = "navigation";
        public const string KeyLog = "key_log";
        public const string Paste = "past";
        public const string Click = "click";
        public const string SessionStarted = "sessie_start";
        public const string SessionResumed = "sessie_resumed";
        public const string SessionFinished = "sessie_finished";
        public const string ItemStarted = "item_start";
        public const string SelectAnswer = "select_answer";
        public const string DeselectAnswer = "deselect_answer";
        public const string Cancelled = "cancelled";
        public const string Autocomplete = "autocomplete";
        public const string Confirmed = "confirmed";
        public const string CreateLink = "link_create";
        public const string DeleteLink = "link_delete";
        public const string OpenLink = "open_hyperlink";
        public const string UndoRemoveLink = "link_remove_undo";
        public const string UndoRemoveLinkAll = "link_remove_undo_all";
        public const string Drag = "object_dragged";
        public const string Color = "collered";
        public const string ColorUndo = "color_undo";
        public const string SelectText = "text_select";
        public const string DeselectText = "text_deselect";
        public const string Levenshtein = "levenshtein";
    }
}