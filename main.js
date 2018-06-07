window.onload = onLoad;
window.onresize = resizeVideos;

function onLoad ()
{
    cacheAspectRatio ();
    resizeVideos ();
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