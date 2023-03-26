$(document).ready(function(){
    var allBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    ShowBookmarks(allBookmarks);

    $("#addBtn").click(function(){
        // just prepare and open the add modal
        $("#modalHeading").html("Add Bookmark");
        $("#bookmarkModal").fadeIn();
        $("#saveBtn").show();  
        $("#updateBtn").hide();
        $("#selectedIdDiv").fadeOut();
    })

    $("#saveBtn").click(function(){
        var bookmarkId = generateBookmarkId();
        var siteName = $("#siteName").val();
        var siteURL = $("#siteURL").val();

        var isValid = isValidBookmark(bookmarkId,siteName,siteURL);

        if(isValid == true){

            var bookmark = {
                id: bookmarkId,
                name: siteName,
                url: siteURL
            };

            var allBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
            allBookmarks.push(bookmark);
            localStorage.setItem('bookmarks', JSON.stringify(allBookmarks));
            ShowBookmarks(allBookmarks);
            $("#closeModalBtn").click();
        }
    }) // end bookmark add


    // now update
    $("#updateBtn").click(function(){
        // get the data from edit modal 
        var bookmarkId = Number($("#bookmarkId").text());
        var newSiteName = $("#siteName").val();
        var newSiteURL = $("#siteURL").val();

        // but before update we need to validate
        var isValid = isValidBookmark(bookmarkId,newSiteName,newSiteURL);

        if(isValid == true){
            var allBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
            var index = allBookmarks.findIndex(bookmark => bookmark.id === bookmarkId);

            allBookmarks[index].name = newSiteName;
            allBookmarks[index].url = newSiteURL;

            localStorage.setItem("bookmarks",JSON.stringify(allBookmarks));
            ShowBookmarks(allBookmarks);
            $("#closeModalBtn").click();
        }
    }) // end update


    // now search
    $("#searchBookmark").keyup(function(){
        var giveName = $(this).val().trim();

        var allBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

        var matchingBookmark = allBookmarks.filter(function(bookmark){
            return bookmark.name.toLowerCase().includes(giveName.toLowerCase());
        })

        ShowBookmarks(matchingBookmark);
    }) // end search

    // close modal
    $("#closeModalBtn").click(function(){
        $("#bookmarkModal").fadeOut();
        $("#selectedIdDiv").fadeOut();
        $("#siteName").val("");
        $("#siteURL").val("");
    })

}) // end jquery


// As edit and delete btn create dynamically
$(document).on('click','.edit-btn',function(){
    // prepare edit modal
    $("#modalHeading").html("Edit Bookmark");
    $("#bookmarkModal").fadeIn();
    $("#saveBtn").hide();  
    $("#updateBtn").show();

    // get the id from button data attr.
    var bookmarkId = Number($(this).attr('data-bookmarkId'));
    
    // search bookmark by this id
    var allBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    var bookmark = allBookmarks.find(function(bm){
        return bm.id === bookmarkId;
    });

    // show data in edit modal
    $("#bookmarkId").html(bookmark.id);
    $("#siteName").val(bookmark.name);
    $("#siteURL").val(bookmark.url);
    $("#selectedIdDiv").show();
})
// edit modal done


// delete
$(document).on('click','.delete-btn',function(){

    //we need a confirmation
    if(confirm("Are you sure want to delete?")){
        // get the id from button data attr.
        var bookmarkId = Number($(this).attr('data-bookmarkId'));
        var allBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

        allBookmarks = allBookmarks.filter(function(bookmark){
            return bookmark.id !== bookmarkId
        })
        
        // update all bookmarks in localstorage
        localStorage.setItem('bookmarks',JSON.stringify(allBookmarks));

        // now you can show a meesage like 'delete success' 
        ShowBookmarks(allBookmarks);
    }
    
})
// end delete


function isValidBookmark(bookmarkId,siteName,siteURL){
    _cmnRemoveAllErrorMessage();
    // Check if URL is valid
    const urlRegex = /^https?:\/\/(.+)$/i;
    var allBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

    if(bookmarkId == "")
    {
        alert("Something wrong! Bookmark ID not found!");
        return false;
    }

    if(siteName == "")
    {
        _cmnShowErrorMessageBottomOfTheInputFiled("siteName","Site Name empty.");
        return false;
    }else if(siteName.length < 3){
        // you can add your coustom message
        _cmnShowErrorMessageBottomOfTheInputFiled("siteName","Not valid name.");
        return false;
    }


    if(siteURL == "")
    {
        _cmnShowErrorMessageBottomOfTheInputFiled("siteURL","Site URL empty.");
        return false;
    }else if(siteURL.length < 3){
        // you can add your coustom message
        _cmnShowErrorMessageBottomOfTheInputFiled("siteURL","Not valid URL.");
        return false;
    }else if (!urlRegex.test(siteURL)) {
        _cmnShowErrorMessageBottomOfTheInputFiled("siteURL","Not valid URL Format.");
        return false;
    }else if(allBookmarks.some(bookmark => bookmark.url === siteURL && bookmark.id !== bookmarkId)){
        // also check if this url alreay exists or not
        // remember for update bookmark siteURL is allow for the bookmarkId

        _cmnShowErrorMessageBottomOfTheInputFiled("siteURL","Bookmark URL already exists.");
        return false;
    }

    return true;

}

function generateBookmarkId(){
    // get all bookmarks if it it null or empty assign an empty array
    // also make it json
    var allBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];

    return allBookmarks.length + 1;
}


function ShowBookmarks(allBookmarks) {

    if(allBookmarks.length > 0){
        // now we will show all bookmarks

        var bookmarksTableRow = '';

        allBookmarks.forEach(function(bookmark){
            bookmarksTableRow += `

                <tr>
                    <td>${bookmark.id}</td>
                    <td><a href="${bookmark.url}">${bookmark.name}</a></td>
                    <td> 
                        <button data-bookmarkId="${bookmark.id}" class="btn delete-btn">Delete</button> 
                        <button data-bookmarkId="${bookmark.id}" class="btn edit-btn">Edit</button> 
                    </td> 
                </tr>

            `;
        })

        // finally add all rows to the table body
        $("#bookmarkTableBody").html(bookmarksTableRow);

    }else{
        // show no bookmark found
        $("#bookmarkTableBody").html("");
        $("#noBookmarkFound").show();
    }
}

