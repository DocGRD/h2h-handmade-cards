/* Local portfolio stand-ins. The shop database and mail host are offline. */
(function ($) {
  if (!$ || !$.ajax) {
    return;
  }

  var originalAjax = $.ajax;

  $.ajax = function (options) {
    var url = (options && options.url) || "";

    if (/filter\.php/.test(url)) {
      var note = document.getElementById("local-filter-note");
      if (!note) {
        note = document.createElement("p");
        note.id = "local-filter-note";
        note.setAttribute("style", "clear:both;margin:12px 0;font-size:14px;");
        var anchor = document.getElementById("portfolio");
        if (anchor) {
          anchor.appendChild(note);
        }
      }
      note.textContent = "Occasion, color, and stamp filters used the shop database, which is offline. Every saved card is already shown.";
      return { abort: function () {} };
    }

    if (/form-handler\.php/.test(url)) {
      if (options.success) {
        options.success("Thank you. This copy runs on your computer, so the message stays here and is not emailed.");
      }
      return { abort: function () {} };
    }

    return originalAjax.apply(this, arguments);
  };

  function clearFixedHeader() {
    var header = document.getElementById("header");
    if (!header) {
      return;
    }
    var fixed = window.getComputedStyle(header).position === "fixed";
    document.documentElement.style.setProperty("--header-offset", fixed ? header.offsetHeight + "px" : "0px");
  }

  $(function () {
    clearFixedHeader();
    $(window).load(clearFixedHeader);
    /* The bundled scroll plugin cancels the click, then animates document.body.
       Current browsers scroll the document element, so the menu never moves. */
    $("#menu a, .gototop a").unbind("click").click(function (event) {
      var hash = this.hash;
      if (!hash || hash.charAt(0) !== "#") {
        return;
      }
      var target = document.querySelector(hash);
      if (!target) {
        return;
      }
      event.preventDefault();
      var header = document.getElementById("header");
      var offset = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
      if (window.history && history.pushState) {
        history.pushState(null, "", hash);
      }
    });
  });
})(window.jQuery);
