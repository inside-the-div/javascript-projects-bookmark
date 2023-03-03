$(document).ready(function(){
   if(localStorage.getItem("bookmark_data") != null)
   {
        ShowBookmarkData();    
   }
    
    $(document).on("click","#OpenBookmarkAddModal",OpenBookmarkAddModal);
    $(document).on("click","#closeModal",CloseBookmarkModal);

    $(document).on("click","#saveBookmark",function(){
       
        var name = $("#name").val();
        var link = $("#link").val();
    
        if(IsValidBookmarkInput("add"))
        {
            var bookmarkId = 1;
            var bookmarkJson;
            if(localStorage.getItem("bookmark_data") == null || JSON.parse(localStorage.getItem("bookmark_data")).bookmarks.length == 0)
            {
                var bookmarks = [];
                bookmarks.push(         
                {
                    "id":bookmarkId,
                    "name":name,
                    "link":link
                }
                );
                bookmarkJson ={
                    "bookmarks" : bookmarks
                }
            }
            else
            {
                bookmarkJson = JSON.parse(localStorage.getItem("bookmark_data"));
                var lastIndexOfArray = bookmarkJson.bookmarks.length-1;
                bookmarkId = Number(bookmarkJson.bookmarks[lastIndexOfArray].id) + 1;
                bookmarkJson.bookmarks.push(
                    {
                        "id":bookmarkId,
                        "name":name,
                        "link":link
                    }
                );
            }
    
            localStorage.setItem("bookmark_data", JSON.stringify(bookmarkJson));
            
            ShowBookmarkData();
            ClearModal();
        }
        else{
            return false;
        }
        
    });
    
    $(document).on("click",".btn-bookmark-delete",function(){
        if (confirm("Are you sure, want to delete?") == true) 
        {
            var bookmarkId = ($(this).attr('data-bookmarkId'));
            var indexNumber;
            var bookmarkJson = JSON.parse(localStorage.getItem("bookmark_data"));

            for(var i = 0 ;i < bookmarkJson.bookmarks.length; i++)
            {
                if(bookmarkJson.bookmarks[i].id == bookmarkId)
                {
                    indexNumber = i;
                    break;
                }
            }
            bookmarkJson.bookmarks.splice(indexNumber, 1);
            localStorage.setItem("bookmark_data", JSON.stringify(bookmarkJson));
            ShowBookmarkData();
        } 
    });

    $(document).on("click",".btn-bookmark-edit",function () {
        
        $("#modalHeading").html("Edit Bookmark");
        $("#bookmarkModal").fadeIn();

        var bookmarkId = ($(this).attr('data-bookmarkId'));
        var indexNumber;
        var bookmarkJson = JSON.parse(localStorage.getItem("bookmark_data"));

        for(var i = 0 ;i < bookmarkJson.bookmarks.length; i++)
        {
            if(bookmarkJson.bookmarks[i].id == bookmarkId)
            {
                indexNumber = i;
                break;
            }
        }

        $("#name").val(bookmarkJson.bookmarks[indexNumber].name);
        $("#link").val(bookmarkJson.bookmarks[indexNumber].link);
        $("#bookmarkId").html(bookmarkJson.bookmarks[indexNumber].id);

        $("#saveBookmark").hide();  
        $("#updateBookmark").show();
        $("#selectedID").show();      
    });

    $(document).on("click","#updateBookmark",function(){
        
        if(IsValidBookmarkInput("update"))
        {
            if (confirm("Are your sure, want to update?") == true) 
            {
                var bookmarkId = Number($("#bookmarkId").text());
                var indexNumber;
                var bookmarkJson = JSON.parse(localStorage.getItem("bookmark_data"));
                for(var i = 0 ;i < bookmarkJson.bookmarks.length; i++)
                {
                    console.log(bookmarkId);
                    if(Number(bookmarkJson.bookmarks[i].id) == bookmarkId)
                    {
                        indexNumber = i;
                        break;
                    }
                }
                
                bookmarkJson.bookmarks[indexNumber].name = $("#name").val();
                bookmarkJson.bookmarks[indexNumber].link = $("#link").val();

                localStorage.setItem("bookmark_data", JSON.stringify(bookmarkJson));
                
                ShowBookmarkData();
                CloseBookmarkModal();
                
            } 
            else 
            {
                CloseBookmarkModal();
            }
        }
    });

});
//end jquery

function IsValidBookmarkInput(action){
    _cmnRemoveAllErrorMessage();
    
    var name = $("#name").val();
    var link = $("#link").val();
    var total_link;

    if(JSON.parse(localStorage.getItem("bookmark_data")) != null){
        existingBookmarksArray = JSON.parse(localStorage.getItem("bookmark_data")).bookmarks;
    }

    if(action == "add")
    {
        if(localStorage.getItem("bookmark_data") == null || existingBookmarksArray.length == 0)
        {
            total_link = 0;
        }
        else
        {
            for(var i = 0; i <existingBookmarksArray.length; i++)
            {
                var bookmarkLink = existingBookmarksArray[i].link;
                if(bookmarkLink == link ){
                    total_link = 1;
                    break;
                }
            }
        }
    }
    else
    {
        var updateId = Number($("#bookmarkId").text());
        if(localStorage.getItem("bookmark_data") == null || existingBookmarksArray.length == 0)
        {
            total_link = 0;
        }
        else
        {
            for(var i = 0; i <existingBookmarksArray.length; i++)
            {
                var bookmarkLink = existingBookmarksArray[i].link;
                var bookmarkId = Number(existingBookmarksArray[i].id);
                if(bookmarkLink == link && bookmarkId != updateId){
                    total_link = 1;
                    break;
                }
            }
        }
    }

    if(name == "")
    {
        _cmnShowErrorMessageBottomOfTheInputFiled("name","Feild can not be empty.");
        return false;
    }

    if(link == "")
    {
        _cmnShowErrorMessageBottomOfTheInputFiled("link","Feild can not be empty.");
        return false;
    }
    else if(link.length < 3)
    {
        _cmnShowErrorMessageBottomOfTheInputFiled("link","Enter a valid link.");
        return false;
    }
    else if(action == "update" && total_link > 0)
    {
        _cmnShowErrorMessageBottomOfTheInputFiled("link","This link already used. Enter valid link.");
        return false; 
    }
    else if(action == "add" && total_link > 0)
    {
        _cmnShowErrorMessageBottomOfTheInputFiled("link","This link already used. Enter valid link.");
        return false; 
    }

    return true;
}

function ClearModal(){
    $("#name").val("");
    $("#link").val("");
    $("#bookmarkId").html("");
    _cmnRemoveAllErrorMessage();
}

function ShowBookmarkData(){
    var bookmarkJson = JSON.parse(localStorage.getItem("bookmark_data"));
    var totalUser = bookmarkJson.bookmarks.length;
    var bookmarkTableRow = "";
    if(localStorage.getItem("bookmark_data") != null)
    {            
        for(var i = 0; i < totalUser; i++)
        {
            bookmarkTableRow += 
            `<tr>
                <td>${bookmarkJson.bookmarks[i].id}</td>
                <td>${bookmarkJson.bookmarks[i].name}</td>
                <td>${bookmarkJson.bookmarks[i].link}</td> 
                <td> 
                    <button data-bookmarkId = "${bookmarkJson.bookmarks[i].id}" class="btn btn-bookmark-delete">Delete</button> 
                    <button data-bookmarkId = "${bookmarkJson.bookmarks[i].id}" class="btn-bookmark-edit btn">Edit</button> 
                </td> 
            </tr>`;
        }
        $("#bookmarkTableBody").html(bookmarkTableRow);
    }
    else
    {
        $("#localStorageEmptyMessage").show(); 
    }       
}

function CloseBookmarkModal()
{
    $("#bookmarkModal").fadeOut();     
    $("#selectedID").fadeOut();
    ClearModal();
}

function OpenBookmarkAddModal()
{
    $("#modalHeading").html("Add Bookmark");
    $("#bookmarkModal").fadeIn();
    $("#saveBookmark").show();  
    $("#updateBookmark").hide();
}