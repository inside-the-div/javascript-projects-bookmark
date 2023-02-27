$(document).ready(function(){
   if(localStorage.getItem("bookmark_data") != null)
   {
        ShowBookmarkData();    
   }
    
    $(document).on("click","#OpenBookmarkAddModal",OpenBookmarkAddModal);
    $(document).on("click","#closeModal",CloseBookmarkModal);

    function OpenBookmarkAddModal(){
        $("#modalHeading").html("Add Bookmark");
        $("#modalContainer").fadeIn();
        $("#save").show();  
        $("#update").hide();
    }

    function CloseBookmarkModal()
    {
        $("#modalContainer").fadeOut();     
        $("#selectedID").fadeOut();
        ClearModal();
    }

    $(document).on("click","#save",SaveBookmarkData)
    
    function IsValidBookmarkInput(){
        var name = $("#name").val();
        var link = $("#link").val();
    
        _cmnRemoveAllErrorMessage();
    
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
    
        return true;
    }
    
    function ClearModal(){
        $("#name").val("");
        $("#link").val("");
        $("#bookmarkId").html("");
        _cmnRemoveAllErrorMessage();
    }
    
    function SaveBookmarkData(){
       
        var name = $("#name").val();
        var link = $("#link").val();
    
        if(IsValidBookmarkInput())
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
                bookmarkJson.bookmarks.push({"id":bookmarkId,
                "name":name,
                "link":link});
            }
    
            localStorage.setItem("bookmark_data", JSON.stringify(bookmarkJson));
            
            ShowBookmarkData();
            ClearModal();
        }
        else{
            return false;
        }
        
    }
    
    function ShowBookmarkData(){
        var bookmark_data = JSON.parse(localStorage.getItem("bookmark_data"));
        var totalUser = bookmark_data.bookmarks.length;
        var usertablerow = "";
        if(localStorage.getItem("bookmark_data") != null)
        {            
            for(var i = 0; i < totalUser; i++)
            {
                usertablerow += 
                `<tr>
                    <td>${bookmark_data.bookmarks[i].id}</td>
                    <td>${bookmark_data.bookmarks[i].name}</td>
                    <td>${bookmark_data.bookmarks[i].link}</td> 
                    <td> 
                        <button data-bookmarkId = "${bookmark_data.bookmarks[i].id}" class="btn btn-bookmark-delete">Delete</button> 
                        <button data-bookmarkId = "${bookmark_data.bookmarks[i].id}" class="btn-bookmark-update btn">Edit</button> 
                    </td> 
                </tr>`;
            }
            
            $("#userTableBody").html(usertablerow);
            if($("#userTableBody").text() == "")
            {
                $("#localStorageEmptyMessage").show(); 
            }
            else{
                $("#localStorageEmptyMessage").hide(); 
            }
        }        
    }

    $(document).on("click",".btn-bookmark-delete",DeleteBookmark);
    
    
    function DeleteBookmark(){
        if (confirm("Are you sure! want to delete?") == true) 
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
    }

    $(document).on("click",".btn-bookmark-update",UpdateBookmarkModal);
    
    function UpdateBookmarkModal() {
        
        $("#modalHeading").html("Update Bookmark");
        $("#modalContainer").fadeIn();
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

        $("#save").hide();  
        $("#update").show();
        $("#selectedID").show();      
    }

    $(document).on("click","#update",UpdateBookmark); 
    
    function UpdateBookmark(){
        
        if(IsValidBookmarkInput())
        {
            if (confirm("Are your sure! want to update?") == true) 
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
    }

});