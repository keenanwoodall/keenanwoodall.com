window.onload = onLoad;

function onLoad ()
{
    fadeOutOverlay ();
}

function fadeOutOverlay ()
{
    setTimeout (function ()
        {   
            document.getElementById ("overlay").style.display = "none";
        }, 1000
    );
}