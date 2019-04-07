window.onload = onLoad;
window.onresize = resizeVideos;

function onLoad ()
{
    document.getElementById ("preloadOverlay").setAttribute ("id", "overlay");

    cacheAspectRatio ();
    resizeVideos ();
    setDuration ();
    disableOverlay ();
}

function cacheAspectRatio ()
{
    var videos = document.getElementsByTagName ("iframe");
    for (var i = 0; i < videos.length; i++)
    {
        var element = videos[i];
        var aspectRatio = element.height / element.width;
        element.removeAttribute ("width");
        element.removeAttribute ("height");
        element.setAttribute ("aspectratio", aspectRatio);
    }
}

function setDuration ()
{
    var e = document.getElementById ("duration");
    var difference = Date.now () - new Date (1375362000000);
    var d = Math.abs (new Date (difference).getUTCFullYear () - 1970);
    e.innerText = d;
}

function resizeVideos ()
{
    var newWidth = document.body.clientWidth;

    var videos = document.getElementsByTagName ("iframe");
    for (var i = 0; i < videos.length; i++)
    {
        var element = videos[i];
        var aspectRatio = element.getAttribute ("aspectratio");

        element.setAttribute ("width", (newWidth * 0.8));
        element.setAttribute ("height", (newWidth * 0.8) * aspectRatio);
    }
}

function disableOverlay ()
{
    setTimeout (function ()
        {   
            document.getElementById ("overlay").style.display = "none";
        }, 1000
    );
}