window.onload = disableOverlay;

function disableOverlay ()
{
    setTimeout (function ()
        {   
            document.getElementById ("overlay").style.display = "none";
        }, 1000
    );
}