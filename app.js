// LOGIN PROTECTION

const currentPage =
  window.location.pathname.split("/").pop();

const protectedPages = [
  "dashboard-pro.html"
];

if (
  protectedPages.includes(currentPage) &&
  localStorage.getItem("fixamLoggedIn") !== "true"
) {

  alert(
    "Please login to access this page."
  );

  window.location.href = "login.html";

}


const themeToggle = document.getElementById("themeToggle");

if (themeToggle) {

  const savedTheme = localStorage.getItem("fixamTheme");

  if (savedTheme === "light") {
    document.body.classList.add("light-mode");
  }

  updateThemeIcon();

  themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("light-mode");

    if (document.body.classList.contains("light-mode")) {
      localStorage.setItem("fixamTheme", "light");
    } else {
      localStorage.setItem("fixamTheme", "dark");
    }

    updateThemeIcon();

  });
}


function updateThemeIcon() {

  const icon = document.querySelector("#themeToggle i");

  if (!icon) {
    return;
  }

  if (document.body.classList.contains("light-mode")) {

    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");

  } else {

    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");

  }

}


// COMMUNITY LIKES

document.addEventListener("DOMContentLoaded", function () {

    // STORAGE KEYS

    const POSTS_KEY = "fixamCommunityPosts";
    const LIKES_KEY = "fixamCommunityLikes";
    const COMMENTS_KEY = "fixamCommunityComments";


    // GET HTML ELEMENTS

    const postButton = document.getElementById("postButton");
    const postName = document.getElementById("postName");
    const postText = document.getElementById("postText");
    const postImage = document.getElementById("postImage");

    const postsContainer =
        document.querySelector(".community-posts");


    //  STORAGE HELPERS


    function getData(key, defaultValue) {

        try {

            const savedData =
                localStorage.getItem(key);

            if (!savedData) {
                return defaultValue;
            }

            return JSON.parse(savedData);

        } catch (error) {

            console.error(
                "Could not read localStorage:",
                error
            );

            return defaultValue;
        }
    }


    function saveData(key, data) {

        try {

            localStorage.setItem(
                key,
                JSON.stringify(data)
            );

        } catch (error) {

            console.error(
                "Could not save to localStorage:",
                error
            );
        }
    }


    //  CREATE UNIQUE POST ID

    function createPostId() {

        return (
            "community-" +
            Date.now() +
            "-" +
            Math.random()
                .toString(36)
                .substring(2, 9)
        );
    }


    // CREATE PROFILE IMAGE

    function createProfileImage(imageSrc) {

        const profile =
            document.createElement("div");

        profile.className =
            "community-profile-image-wrapper";

        profile.style.width = "50px";
        profile.style.height = "50px";
        profile.style.minWidth = "50px";
        profile.style.borderRadius = "50%";
        profile.style.overflow = "hidden";
        profile.style.display = "flex";
        profile.style.alignItems = "center";
        profile.style.justifyContent = "center";
        profile.style.background = "#10c7ff";
        profile.style.marginRight = "12px";


        if (imageSrc) {

            const image =
                document.createElement("img");

            image.src = imageSrc;

            image.alt = "Profile picture";

            image.style.width = "100%";
            image.style.height = "100%";
            image.style.objectFit = "cover";

            profile.appendChild(image);

        } else {

            const icon =
                document.createElement("i");

            icon.className =
                "fa-solid fa-user";

            icon.style.color = "white";

            profile.appendChild(icon);
        }


        return profile;
    }


    // CREATE NEW POST ON SCREEN


    function displayNewPost(postData) {

        if (!postsContainer) {
            return;
        }


        const post =
            document.createElement("div");

        post.className =
            "glass-card p-4 mb-4 community-post";

        post.dataset.postId =
            postData.id;


        //  POST HEADER
      

        const header =
            document.createElement("div");

        header.className =
            "d-flex align-items-center mb-3";


        const profile =
            createProfileImage(
                postData.image
            );


        const userInfo =
            document.createElement("div");


        const name =
            document.createElement("h6");

        name.className =
            "mb-0 post-name";

        name.textContent =
            postData.name;


        const date =
            document.createElement("small");

        date.className =
            "text-muted";

        date.textContent =
            postData.date || "Just now";


        userInfo.appendChild(name);
        userInfo.appendChild(date);


        header.appendChild(profile);
        header.appendChild(userInfo);


        // POST TEXT

        const text =
            document.createElement("p");

        text.className =
            "mb-3";

        text.style.whiteSpace =
            "pre-wrap";

        text.textContent =
            postData.text;


        // BUTTONS
    

        const buttons =
            document.createElement("div");

        buttons.className =
            "d-flex gap-2 flex-wrap";


        const likeButton =
            document.createElement("button");

        likeButton.type = "button";

        likeButton.className =
            "btn btn-sm btn-outline-light like-btn";

        likeButton.innerHTML = `
            <i class="fa-regular fa-thumbs-up me-1"></i>
            Like
            <span class="like-count">0</span>
        `;


        const commentButton =
            document.createElement("button");

        commentButton.type = "button";

        commentButton.className =
            "btn btn-sm btn-outline-light comment-btn";

        commentButton.innerHTML = `
            <i class="fa-regular fa-comment me-1"></i>
            Comment
        `;


        buttons.appendChild(likeButton);
        buttons.appendChild(commentButton);


        // COMMENT AREA
      

        const commentArea =
            document.createElement("div");

        commentArea.className =
            "comment-area mt-3";

        commentArea.style.display =
            "none";


        const commentsList =
            document.createElement("div");

        commentsList.className =
            "comments-list mb-3";


        const commentInput =
            document.createElement("input");

        commentInput.type = "text";

        commentInput.className =
            "form-control comment-input mb-2";

        commentInput.placeholder =
            "Write a comment...";


        const commentSubmit =
            document.createElement("button");

        commentSubmit.type = "button";

        commentSubmit.className =
            "btn btn-sm btn-primary comment-submit";

        commentSubmit.textContent =
            "Post Comment";


        commentArea.appendChild(
            commentsList
        );

        commentArea.appendChild(
            commentInput
        );

        commentArea.appendChild(
            commentSubmit
        );


        
         //  ADD EVERYTHING TO POST

        post.appendChild(header);
        post.appendChild(text);
        post.appendChild(buttons);
        post.appendChild(commentArea);


        /* Put newest post at the top */

        postsContainer.prepend(post);


        /* Restore saved data */

        restoreLikes(post);
        loadComments(post);
    }


    // LOAD SAVED POSTS

    function loadSavedPosts() {

        if (!postsContainer) {
            return;
        }


        const savedPosts =
            getData(
                POSTS_KEY,
                []
            );


        savedPosts.forEach(function (post) {

            if (!post.id) {
                post.id = createPostId();
            }


            /*
             * Old posts created before the
             * name system will become Anonymous.
             */

            if (!post.name) {
                post.name = "Anonymous";
            }


            if (!post.date) {
                post.date = "Just now";
            }


            displayNewPost(post);
        });


        saveData(
            POSTS_KEY,
            savedPosts
        );
    }


    // GIVE STATIC POSTS IDs

    function prepareStaticPosts() {

        const staticPosts =
            document.querySelectorAll(
                ".community-post"
            );


        staticPosts.forEach(
            function (post, index) {

                if (!post.dataset.postId) {

                    post.dataset.postId =
                        "static-post-" +
                        index;
                }


                restoreLikes(post);
                loadComments(post);
            }
        );
    }



    //  RESTORE LIKES

    function restoreLikes(post) {

        const postId =
            post.dataset.postId;


        if (!postId) {
            return;
        }


        const likes =
            getData(
                LIKES_KEY,
                {}
            );


        const count =
            Number(likes[postId]) || 0;


        const button =
            post.querySelector(
                ".like-btn"
            );


        const countElement =
            post.querySelector(
                ".like-count"
            );


        if (!button || !countElement) {
            return;
        }


        countElement.textContent =
            count;


        if (count > 0) {

            button.classList.remove(
                "btn-outline-light"
            );

            button.classList.add(
                "btn-primary"
            );

        } else {

            button.classList.remove(
                "btn-primary"
            );

            button.classList.add(
                "btn-outline-light"
            );
        }
    }


    // COMMENT BUTTON

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".like-btn"
                );


            if (!button) {
                return;
            }


            const post =
                button.closest(
                    ".community-post"
                );


            if (!post) {
                return;
            }


            const postId =
                post.dataset.postId;


            if (!postId) {
                return;
            }


            const likes =
                getData(
                    LIKES_KEY,
                    {}
                );


            let count =
                Number(likes[postId]) || 0;


            const alreadyLiked =
                button.classList.contains(
                    "btn-primary"
                );


            if (alreadyLiked) {

                count =
                    Math.max(
                        0,
                        count - 1
                    );

            } else {

                count++;
            }


            likes[postId] =
                count;


            saveData(
                LIKES_KEY,
                likes
            );


            restoreLikes(post);
        }
    );


      //  COMMENT BUTTON

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".comment-btn"
                );


            if (!button) {
                return;
            }


            const post =
                button.closest(
                    ".community-post"
                );


            if (!post) {
                return;
            }


            const commentArea =
                post.querySelector(
                    ".comment-area"
                );


            if (!commentArea) {
                return;
            }


            const isHidden =
                commentArea.style.display ===
                "none";


            commentArea.style.display =
                isHidden
                    ? "block"
                    : "none";


            if (isHidden) {

                const input =
                    commentArea.querySelector(
                        ".comment-input"
                    );


                if (input) {
                    input.focus();
                }
            }
        }
    );

    
    //  POST COMMENT

    document.addEventListener(
        "click",
        function (event) {

            const button =
                event.target.closest(
                    ".comment-submit"
                );


            if (!button) {
                return;
            }


            const post =
                button.closest(
                    ".community-post"
                );


            if (!post) {
                return;
            }


            const input =
                post.querySelector(
                    ".comment-input"
                );


            if (!input) {
                return;
            }


            const commentText =
                input.value.trim();


            if (!commentText) {

                alert(
                    "Please write a comment."
                );

                input.focus();

                return;
            }


            const postId =
                post.dataset.postId;


            const comments =
                getData(
                    COMMENTS_KEY,
                    {}
                );


            if (
                !Array.isArray(
                    comments[postId]
                )
            ) {

                comments[postId] = [];
            }


            comments[postId].push({

                text: commentText,

                date: "Just now"
            });


            saveData(
                COMMENTS_KEY,
                comments
            );


            input.value = "";


            loadComments(post);
        }
    );


   //  LOAD COMMENTS

    function loadComments(post) {

        const postId =
            post.dataset.postId;


        if (!postId) {
            return;
        }


        const comments =
            getData(
                COMMENTS_KEY,
                {}
            );


        const postComments =
            comments[postId] || [];


        const commentsList =
            post.querySelector(
                ".comments-list"
            );


        if (!commentsList) {
            return;
        }


        commentsList.innerHTML = "";


        postComments.forEach(
            function (comment) {

                const commentBox =
                    document.createElement(
                        "div"
                    );


                commentBox.className =
                    "p-2 mb-2 rounded";


                commentBox.style.background =
                    "rgba(255,255,255,0.08)";


                const commentText =
                    document.createElement(
                        "div"
                    );


                commentText.textContent =
                    comment.text;


                const commentDate =
                    document.createElement(
                        "small"
                    );


                commentDate.className =
                    "text-muted";


                commentDate.textContent =
                    comment.date ||
                    "Just now";


                commentBox.appendChild(
                    commentText
                );


                commentBox.appendChild(
                    commentDate
                );


                commentsList.appendChild(
                    commentBox
                );
            }
        );
    }


    //  CREATE NEW POST

    if (postButton) {

        postButton.addEventListener(
            "click",
            function () {

                const name =
                    postName
                        ? postName.value.trim()
                        : "";


                const text =
                    postText
                        ? postText.value.trim()
                        : "";


                // NAME REQUIRED

                if (!name) {

                    alert(
                        "Please enter your full name."
                    );


                    if (postName) {
                        postName.focus();
                    }


                    return;
                }


               // EXPERIENCE REQUIRED

                if (!text) {

                    alert(
                        "Please share your experience or ask a question."
                    );


                    if (postText) {
                        postText.focus();
                    }


                    return;
                }


               //  GET IMAGE 


                let file = null;


                if (
                    postImage &&
                    postImage.files.length > 0
                ) {

                    file =
                        postImage.files[0];
                }


             // IMAGE SIZE CHECK

                if (
                    file &&
                    file.size >
                    2 * 1024 * 1024
                ) {

                    alert(
                        "Please choose an image smaller than 2MB."
                    );

                    return;
                }


               // SAVE WITHOUT IMAGE

                if (!file) {

                    saveNewPost(
                        name,
                        text,
                        ""
                    );

                    return;
                }


                //  SAVE WITH IMAGE

                const reader =
                    new FileReader();


                reader.onload =
                    function (event) {

                        saveNewPost(
                            name,
                            text,
                            event.target.result
                        );
                    };


                reader.onerror =
                    function () {

                        alert(
                            "Unable to read the selected image."
                        );
                    };


                reader.readAsDataURL(file);
            }
        );
    }


    // SAVE NEW POST

    function saveNewPost(
        name,
        text,
        image
    ) {

        const posts =
            getData(
                POSTS_KEY,
                []
            );


        const newPost = {

            id: createPostId(),

            name: name,

            text: text,

            image: image,

            date: "Just now"
        };


        posts.push(newPost);


        saveData(
            POSTS_KEY,
            posts
        );


        displayNewPost(
            newPost
        );


        //  CLEAR FORM

        if (postName) {
            postName.value = "";
        }


        if (postText) {
            postText.value = "";
        }


        if (postImage) {
            postImage.value = "";
        }
    }



    //  ENTER KEY FOR COMMENTS


    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key !== "Enter"
            ) {
                return;
            }


            if (
                !event.target.classList.contains(
                    "comment-input"
                )
            ) {
                return;
            }


            event.preventDefault();


            const post =
                event.target.closest(
                    ".community-post"
                );


            if (!post) {
                return;
            }


            const submitButton =
                post.querySelector(
                    ".comment-submit"
                );


            if (submitButton) {
                submitButton.click();
            }
        }
    );


   // START COMMUNITY SYSTEM

    prepareStaticPosts();

    loadSavedPosts();


    console.log(
        "FixAm Lagos Community system is ready."
    );

});


//  FIND PROFESSIONAL - SEARCH

const findForm =
  document.querySelector(".search-box form");


if (findForm) {

  findForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const searchInput =
      findForm.querySelector('input[type="search"]');

    const locationSelect =
      findForm.querySelector("select");


    const searchValue =
      searchInput.value.toLowerCase().trim();

    const locationValue =
      locationSelect.value.toLowerCase();


    const professionals =
      document.querySelectorAll(".professional-card");


    let found = 0;


    professionals.forEach(function (card) {

      const cardText =
        card.textContent.toLowerCase();


      const matchesService =
        searchValue === "" ||
        cardText.includes(searchValue);


      const matchesLocation =
        locationValue === "select location" ||
        cardText.includes(locationValue);


      if (matchesService && matchesLocation) {

        card.style.display = "";

        found++;

      } else {

        card.style.display = "none";

      }

    });


    alert(found + " professional(s) found.");

  });

}


// LOGIN FORM

const loginForm =
  document.getElementById("loginForm");

if (loginForm) {

  loginForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const email =
      document.getElementById("loginEmail").value.trim();

    const password =
      document.getElementById("loginPassword").value;


    // Get saved accounts

    const savedProfessional =
      localStorage.getItem("fixamProfessional");

    const savedClient =
      localStorage.getItem("fixamClient");


    // Check Professional Account

    if (savedProfessional) {

      const professional =
        JSON.parse(savedProfessional);

      if (
        email === professional.email &&
        password === professional.password
      ) {

        localStorage.setItem(
          "fixamLoggedIn",
          "true"
        );

        localStorage.setItem(
          "fixamUserType",
          "professional"
        );

        alert(
          "Login successful! Welcome, " +
          professional.name + "!"
        );

        window.location.href =
          "dashboard-pro.html";

        return;
      }

    }


    // Check Client Account

    if (savedClient) {

      const client =
        JSON.parse(savedClient);

      if (
        email === client.email &&
        password === client.password
      ) {

        localStorage.setItem(
          "fixamLoggedIn",
          "true"
        );

        localStorage.setItem(
          "fixamUserType",
          "client"
        );

        alert(
          "Login successful! Welcome, " +
          client.name + "!"
        );

        window.location.href =
          "dashboard-client.html";

        return;
      }

    }


    // Incorrect login

    alert(
      "Incorrect email or password. Please try again."
    );

  });

}

// PROFESSIONAL REGISTRATION

const registerForm =
  document.getElementById("registerForm");

if (registerForm) {

  registerForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name =
      document.getElementById("registerName").value.trim();

    const email =
      document.getElementById("registerEmail").value.trim();

    const phone =
      document.getElementById("registerPhone").value.trim();

    const profession =
      document.getElementById("registerProfession").value;

    const location =
      document.getElementById("registerLocation").value;

    const experience =
      document.getElementById("registerExperience").value;

    const address =
      document.getElementById("registerAddress").value.trim();

    const picture =
      document.getElementById("registerPicture");

    const cv =
      document.getElementById("registerCV");

    const password =
      document.getElementById("registerPassword").value;

    const confirmPassword =
      document.getElementById("registerConfirmPassword").value;


    // Check password

    if (password !== confirmPassword) {

      alert("Passwords do not match.");

      return;
    }


    // Check picture

    if (!picture.files.length) {

      alert("Please upload your profile picture.");

      return;
    }


    // Check CV

    if (!cv.files.length) {

      alert("Please upload your CV.");

      return;
    }


    // Create professional account

    const professional = {

      name: name,

      email: email,

      phone: phone,

      profession: profession,

      location: location,

      experience: experience,

      address: address,

      picture: picture.files[0].name,

      cv: cv.files[0].name,

      password: password

    };


    // Save account information

    localStorage.setItem(
      "fixamProfessional",
      JSON.stringify(professional)
    );


    alert(
      "Professional account created successfully!\n\n" +
      "Welcome to FixAm Lagos, " + name + "!"
    );


    // Go to login page

    window.location.href = "login.html";

  });

}

// PROFESSIONAL DASHBOARD
//    ACCEPT REQUEST

document.addEventListener("click", function (event) {

  const acceptButton =
    event.target.closest(".accept-request");

  if (!acceptButton) {
    return;
  }

  const request =
    acceptButton.closest(".dashboard-request");

  if (!request) {
    return;
  }

  const status =
    request.querySelector(".badge");


  if (status) {

    status.textContent = "Accepted";

    status.className =
      "badge bg-info text-dark";

  }


  acceptButton.textContent =
    "Accepted";

  acceptButton.disabled = true;


  alert(
    "Service request accepted successfully!"
  );

});

// PROFESSIONAL DASHBOARD
//    VIEW DETAILS

document.addEventListener("click", function (event) {

  const detailsButton =
    event.target.closest(".view-details");

  if (!detailsButton) {
    return;
  }

  const request =
    detailsButton.closest(".dashboard-request");

  if (!request) {
    return;
  }


  const titleElement =
    request.querySelector("h6");

  const smallElements =
    request.querySelectorAll("small");


  const title =
    titleElement
      ? titleElement.textContent
      : "Service Request";


  const customer =
    smallElements[0]
      ? smallElements[0].textContent
      : "Customer information unavailable";


  const location =
    smallElements[1]
      ? smallElements[1].textContent
      : "Location unavailable";


  alert(
    "Service Request Details\n\n" +
    title + "\n" +
    customer + "\n" +
    location
  );

});


// BLOG SEARCH

const blogSearch =
  document.getElementById("blogSearch");


if (blogSearch) {

  blogSearch.addEventListener("input", function () {

    const searchValue =
      blogSearch.value.toLowerCase().trim();


    const blogCards =
      document.querySelectorAll(".blog-card");


    blogCards.forEach(function (card) {

      const cardText =
        card.textContent.toLowerCase();


      if (
        searchValue === "" ||
        cardText.includes(searchValue)
      ) {

        card.style.display = "";

      } else {

        card.style.display = "none";

      }

    });

  });

}

//  CONTACT FORM

const contactForm =
  document.getElementById("contactForm");


if (contactForm) {

  contactForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const name =
      contactForm.querySelector(
        'input[name="name"]'
      );

    const email =
      contactForm.querySelector(
        'input[type="email"]'
      );

    const message =
      contactForm.querySelector(
        "textarea"
      );


    if (
      !name ||
      !email ||
      !message
    ) {

      alert("Please fill in all required fields.");

      return;

    }


    if (
      name.value.trim() === "" ||
      email.value.trim() === "" ||
      message.value.trim() === ""
    ) {

      alert("Please fill in all required fields.");

      return;

    }


    alert(
      "Your message has been sent successfully!"
    );


    contactForm.reset();

  });

}

//  CLIENT DASHBOARD
//    QUICK ACTIONS

document.addEventListener("click", function (event) {

  const dashboardAction =
    event.target.closest(".dashboard-action");

  if (!dashboardAction) {
    return;
  }


  const href =
    dashboardAction.getAttribute("href");


  if (
    href === "#" ||
    !href
  ) {

    event.preventDefault();

    alert(
      "This feature will be available soon."
    );

  }

});



// // POST JOB FORM 

// const postJobForm2 = document.getElementById("postJobForm");

// if (postJobForm2) {
//   postJobForm.addEventListener("submit", function (event) {
//     event.preventDefault();

//     const loggedIn = localStorage.getItem("fixamLoggedIn");
//     const userType = localStorage.getItem("fixamUserType");

//     if (loggedIn !== "true" || userType !== "professional") {
//       alert("Please login as a professional before posting a job.");
//       window.location.href = "login.html";
//       return;
//     }

    // const paymentCompleted =
    //   localStorage.getItem("fixamPaymentCompleted");

    // if (paymentCompleted !== "true") {
    //   alert("A payment of ₦10,000 is required before posting a job.");
    //   window.location.href = "payment.html";
    //   return;
    // }

    // const paymentUsed =
    //   localStorage.getItem("fixamPaymentUsed");

    // if (paymentUsed === "true") {
    //   alert(
    //     "Your previous ₦10,000 payment has already been used for one job.\n\n" +
    //     "Please make another ₦10,000 payment to post another job."
    //   );

    //   localStorage.removeItem("fixamPaymentCompleted");
    //   window.location.href = "payment.html";
    //   return;
    // }

    // // NEW PROFESSIONAL DETAILS
    // const professionalName =
    //   document.getElementById("professionalName").value.trim();

    // const professionalOccupation =
    //   document.getElementById("professionalOccupation").value.trim();

    // const professionalWorkType =
    //   document.getElementById("professionalWorkType").value;

    // const professionalGender =
    //   document.getElementById("professionalGender").value;

    // const professionalAddress =
    //   document.getElementById("professionalAddress").value.trim();

    // // EXISTING JOB DETAILS
    // const jobTitle =
    //   document.getElementById("jobTitle").value.trim();


    // // CHECK REQUIRED FIELDS
    // if (
    //   professionalName === "" ||
    //   professionalOccupation === "" ||
    //   professionalWorkType === "" ||
    //   professionalGender === "" ||
    //   professionalAddress === "" ||
    //   jobTitle === "" ||
    //   jobCategory === "" ||
    //   jobDescription === "" ||
    //   jobLocation === "" ||
    //   jobDate === "" ||
    //   jobTime === "" ||
    //   jobBudget === "" ||
    //   !jobAgreement.checked
    // ) {
    //   alert(
    //     "Please fill in all required fields and accept the agreement."
    //   );
    //   return;
    // }

    // // CREATE NEW JOB
    // const newJob = {
    //   professionalName: professionalName,
    //   occupation: professionalOccupation,
    //   workType: professionalWorkType,
    //   gender: professionalGender,
    //   address: professionalAddress,

    //   title: jobTitle,
    //   category: jobCategory,
    //   description: jobDescription,
    //   location: jobLocation,
    //   date: jobDate,
    //   time: jobTime,
    //   budget: jobBudget,
    //   additionalInfo: additionalInfo,

    //   status: "Pending",
    //   payment: "₦10,000",
    //   submittedAt: new Date().toLocaleString("en-NG")
    // };

    // // SAVE JOB
    // localStorage.setItem(
    //   "fixamPendingJob",
    //   JSON.stringify(newJob)
    // );

    
    // // MARK PAYMENT AS USED

    // localStorage.setItem(
    //    "fixamPaymentUsed",
    //    "true"
    //  );

    //  localStorage.removeItem(
    //    "fixamPaymentCompleted"
    //  );

    //  alert(
    //    "Job submitted successfully!\n\n" +
    //    "Your job is now pending admin approval."
    //  );

//      window.location.href = "dashboard-pro.html";
//    });
//  }


// BOOKING FORM
//    SAVED WITH LOCAL STORAGE

const bookingForm =
  document.getElementById("bookingForm");

if (bookingForm) {

  const bookingHistory =
    document.querySelector(".booking-history-card");


  /* Display a booking */

  function displayBooking(booking, addToTop = false) {

    const appointment =
      document.createElement("div");

    appointment.className =
      "booking-appointment p-3 mb-3";

    appointment.innerHTML = `

      <div class="d-flex justify-content-between align-items-center">

        <div>

          <h6 class="fw-bold mb-1">
            ${booking.service}
          </h6>

          <small class="text-secondary">
            ${booking.professional}
          </small>

          <br>

          <small class="text-secondary">
            <i class="fa-solid fa-calendar me-1"></i>
            ${booking.date}
          </small>

          <br>

          <small class="text-secondary">
            <i class="fa-solid fa-clock me-1"></i>
            ${booking.time}
          </small>

          <br>

           <small class="text-secondary">
             <i class="fa-solid fa-location-dot me-1"></i>
             ${booking.location}
           </small>

         </div>

         <span class="badge bg-info text-dark">
           Confirmed
         </span>

       </div>

     `;


    if (addToTop) {

      const firstAppointment =
        bookingHistory.querySelector(".booking-appointment");

      if (firstAppointment) {

        firstAppointment.parentNode.insertBefore(
          appointment,
          firstAppointment
        );

      } else {

        bookingHistory.appendChild(appointment);

      }

    } else {

      bookingHistory.appendChild(appointment);

    }

  }


  /* Load saved bookings */

  const savedBookings =
    JSON.parse(
      localStorage.getItem("fixamBookings")
    ) || [];


  savedBookings.forEach(function (booking) {

    displayBooking(booking);

  });


  /* Submit booking */

   bookingForm.addEventListener("submit", function (event) {

     event.preventDefault();


     const professional =
       document.getElementById("bookingProfessional").value;

     const service =
       document.getElementById("bookingService").value;

     const date =
       document.getElementById("bookingDate").value;

     const time =
       document.getElementById("bookingTime").value;

     const location =
       document.getElementById("bookingLocation").value;

     const address =
       document.getElementById("bookingAddress").value.trim();

     const details =
       document.getElementById("bookingDetails").value.trim();

     const budget =
     document.getElementById("bookingBudget").value;


    if (
       professional === "" ||
       service === "" ||
       date === "" ||
       time === "" ||
       location === "" ||
       address === "" ||
       details === "" ||
       budget === ""
     ) {

       alert("Please fill in all required fields.");

       return;
     }


   /* Format date */

    const appointmentDate =
      new Date(date + "T00:00:00");

    const formattedDate =
      appointmentDate.toLocaleDateString("en-NG", {

        day: "numeric",

        month: "long",

        year: "numeric"

      });


    /* Create booking object */

    const newBooking = {

      professional: professional,

      service: service,

      date: formattedDate,

      time: time,

      location: location,

      address: address,

      details: details,

      budget: budget

    };


     /* Save booking */

    savedBookings.unshift(newBooking);

    localStorage.setItem(
      "fixamBookings",
      JSON.stringify(savedBookings)
    );


    /* Display booking immediately */

    displayBooking(newBooking, true);


    /* Success message */

    alert(
      "Booking confirmed successfully!\n\n" +
      service + "\n" +
      professional + "\n" +
      formattedDate + " at " +
      time
    );


    /* Clear form */

    bookingForm.reset();

  });

}

//  REVIEWS FORM
//    SAVED PERMANENTLY WITH LOCAL STORAGE

const reviewForm =
  document.getElementById("reviewForm");

if (reviewForm) {

  const reviewsList =
    document.getElementById("reviewsList");


  /* Display a review */

  function displayReview(review, addToTop = false) {

    let stars = "";

    for (let i = 1; i <= 5; i++) {

      if (i <= Number(review.rating)) {

        stars +=
          '<i class="fa-solid fa-star"></i>';

      } else {

        stars +=
          '<i class="fa-regular fa-star"></i>';

      }

    }


    const newReview =
      document.createElement("div");

    newReview.className =
      "glass-card p-4 mb-4 review-card";

    newReview.innerHTML = `

      <div class="d-flex align-items-center mb-3">

        <div class="review-avatar">
          <i class="fa-solid fa-user"></i>
         </div>

         <div class="ms-3">

           <h5 class="mb-1">
             ${review.name}
           </h5>

           <div class="text-warning">
             ${stars}
           </div>

         </div>

       </div>

       <p class="mb-2">
         ${review.text}
       </p>

       <small class="text-secondary">
         ${review.date}
       </small>

     `;


    if (addToTop) {
      reviewsList.prepend(newReview);

    } else {

      reviewsList.appendChild(newReview);

    }

  }


   /* Load saved reviews */

   const savedReviews =
     JSON.parse(
       localStorage.getItem("fixamReviews")
     ) || [];


   savedReviews.forEach(function (review) {

    displayReview(review);

  });


  /* Submit new review */

  reviewForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name =
      document.getElementById("reviewName").value.trim();

    const rating =
      document.getElementById("reviewRating").value;

    const reviewText =
      document.getElementById("reviewText").value.trim();


    if (
      name === "" ||
      rating === "" ||
      reviewText === ""
    ) {

      alert("Please fill in all required fields.");

      return;

    }


    /* Create review object */

    const newReview = {

      name: name,

      rating: Number(rating),

      text: reviewText,

      date: "Posted just now"

    };

  /* Save review */

   savedReviews.unshift(newReview);

     localStorage.setItem(
     "fixamReviews",
      JSON.stringify(savedReviews)

    );


    /* Show review immediately */

    displayReview(newReview, true);


    alert(
      "Your review has been submitted successfully!"
    );


    /* Clear form */

    reviewForm.reset();

  });

}



// MECHANICS SEARCH & LOCATION FILTER

const mechanicSearch =
  document.getElementById("mechanicSearch");

const mechanicLocation =
  document.getElementById("mechanicLocation");

const mechanicItems =
  document.querySelectorAll(".mechanic-item");

const mechanicNoResults =
  document.getElementById("mechanicNoResults");


if (
  mechanicSearch &&
  mechanicLocation
) {

  function filterMechanics() {

    const searchValue =
      mechanicSearch.value.toLowerCase().trim();

    const locationValue =
      mechanicLocation.value.toLowerCase();

    let found = 0;


    mechanicItems.forEach(function (item) {

      const itemText =
        item.textContent.toLowerCase();

      const matchesSearch =
        searchValue === "" ||
        itemText.includes(searchValue);

      const matchesLocation =
        locationValue === "" ||
        itemText.includes(locationValue);


      if (
        matchesSearch &&
        matchesLocation
      ) {

        item.style.display = "";

        found++;

      } else {

        item.style.display = "none";

      }

    });


    if (mechanicNoResults) {

      if (found === 0) {

        mechanicNoResults.style.display = "block";

      } else {

        mechanicNoResults.style.display = "none";

      }

    }

  }


  /* Search while typing */

  mechanicSearch.addEventListener(
    "input",
    filterMechanics
  );


  /* Filter when location changes */

  mechanicLocation.addEventListener(
    "change",
    filterMechanics
  );

}


//  CARPENTERS SEARCH & LOCATION FILTER

const carpenterSearch =
  document.getElementById("carpenterSearch");

const carpenterLocation =
  document.getElementById("carpenterLocation");

const carpenterItems =
  document.querySelectorAll(".carpenter-item");

const carpenterNoResults =
  document.getElementById("carpenterNoResults");


if (
  carpenterSearch &&
  carpenterLocation
) {

  function filterCarpenters() {

    const searchValue =
      carpenterSearch.value.toLowerCase().trim();

    const locationValue =
      carpenterLocation.value.toLowerCase();

    let found = 0;


    carpenterItems.forEach(function (item) {

      const itemText =
        item.textContent.toLowerCase();

      const matchesSearch =
        searchValue === "" ||
        itemText.includes(searchValue);

      const matchesLocation =
        locationValue === "" ||
        itemText.includes(locationValue);


      if (
        matchesSearch &&
        matchesLocation
      ) {

        item.style.display = "";

        found++;

      } else {

        item.style.display = "none";

      }

    });


    if (carpenterNoResults) {

      if (found === 0) {

        carpenterNoResults.style.display = "block";

      } else {

        carpenterNoResults.style.display = "none";

      }

    }

  }


  /* Search while typing */

  carpenterSearch.addEventListener(
    "input",
    filterCarpenters
  );


  /* Filter by location */

  carpenterLocation.addEventListener(
    "change",
    filterCarpenters
  );

}

//  PAINTERS SEARCH & LOCATION FILTER

const painterSearch = document.getElementById("painterSearch");
const painterLocation = document.getElementById("painterLocation");
const painterItems = document.querySelectorAll(".painter-item");
const painterNoResults = document.getElementById("painterNoResults");

if (painterSearch && painterLocation && painterItems.length > 0) {

  function filterPainters() {

    const searchText = painterSearch.value.toLowerCase().trim();
    const selectedLocation = painterLocation.value.toLowerCase().trim();

    let visibleCount = 0;

    painterItems.forEach(function (item) {

      const painterName =
        item.querySelector("h5")?.textContent.toLowerCase() || "";

      const painterLocationText =
        item.textContent.toLowerCase();

      const matchesSearch =
        painterName.includes(searchText) ||
        painterLocationText.includes(searchText);

      const matchesLocation =
        selectedLocation === "" ||
        painterLocationText.includes(selectedLocation);

      if (matchesSearch && matchesLocation) {

        item.style.display = "";
        visibleCount++;

      } else {

        item.style.display = "none";

      }

    });

    if (painterNoResults) {

      painterNoResults.style.display =
        visibleCount === 0 ? "block" : "none";

    }

  }

  painterSearch.addEventListener(
    "input",
    filterPainters
  );

  painterLocation.addEventListener(
    "change",
    filterPainters
  );

}

// DRY CLEANERS SEARCH & LOCATION FILTER

const drycleanerSearch =
  document.getElementById("drycleanerSearch");

const drycleanerLocation =
  document.getElementById("drycleanerLocation");

const drycleanerItems =
  document.querySelectorAll(".drycleaner-item");

const drycleanerNoResults =
  document.getElementById("drycleanerNoResults");


if (
  drycleanerSearch &&
  drycleanerLocation &&
  drycleanerItems.length > 0
) {

  function filterDryCleaners() {

    const searchText =
      drycleanerSearch.value.toLowerCase().trim();

    const selectedLocation =
      drycleanerLocation.value.toLowerCase().trim();

    let visibleCount = 0;


    drycleanerItems.forEach(function (item) {

      const cleanerText =
        item.textContent.toLowerCase();

      const matchesSearch =
        searchText === "" ||
        cleanerText.includes(searchText);

      const matchesLocation =
        selectedLocation === "" ||
        cleanerText.includes(selectedLocation);


      if (
        matchesSearch &&
        matchesLocation
      ) {

        item.style.display = "";

        visibleCount++;

      } else {

        item.style.display = "none";

      }

    });


    if (drycleanerNoResults) {

      if (visibleCount === 0) {

        drycleanerNoResults.style.display = "block";

      } else {

        drycleanerNoResults.style.display = "none";

      }

    }

  }


  drycleanerSearch.addEventListener(
    "input",
    filterDryCleaners
  );


  drycleanerLocation.addEventListener(
    "change",
    filterDryCleaners
  );

}


// COOKS & CATERERS SEARCH & LOCATION FILTER

const cookSearch =
  document.getElementById("cookSearch");

const cookLocation =
  document.getElementById("cookLocation");

const cookItems =
  document.querySelectorAll(".cook-item");

const cookNoResults =
  document.getElementById("cookNoResults");


if (
  cookSearch &&
  cookLocation &&
  cookItems.length > 0
) {

  function filterCooks() {

    const searchText =
      cookSearch.value.toLowerCase().trim();

    const selectedLocation =
      cookLocation.value.toLowerCase().trim();

    let visibleCount = 0;


    cookItems.forEach(function (item) {

      const cookText =
        item.textContent.toLowerCase();

      const matchesSearch =
        searchText === "" ||
        cookText.includes(searchText);

      const matchesLocation =
        selectedLocation === "" ||
        cookText.includes(selectedLocation);


      if (
        matchesSearch &&
        matchesLocation
      ) {

        item.style.display = "";

        visibleCount++;

      } else {

        item.style.display = "none";

      }

    });


    if (cookNoResults) {

      if (visibleCount === 0) {

        cookNoResults.style.display = "block";

      } else {

        cookNoResults.style.display = "none";

      }

    }

  }


  cookSearch.addEventListener(
    "input",
    filterCooks
  );


  cookLocation.addEventListener(
    "change",
    filterCooks
  );

}

// CLIENT REGISTRATION

const clientRegisterForm =
  document.getElementById("clientRegisterForm");

if (clientRegisterForm) {

  clientRegisterForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name =
      document.getElementById("clientName").value.trim();

    const email =
      document.getElementById("clientEmail").value.trim();

    const phone =
      document.getElementById("clientPhone").value.trim();

    const location =
      document.getElementById("clientLocation").value;

    const address =
      document.getElementById("clientAddress").value.trim();

    const password =
      document.getElementById("clientPassword").value;

    const confirmPassword =
      document.getElementById("clientConfirmPassword").value;


    // Check password

    if (password !== confirmPassword) {

      alert("Passwords do not match.");

      return;

    }


    // Create client account

    const client = {

      name: name,

      email: email,

      phone: phone,

      location: location,

      address: address,

      password: password

    };


    // Save client account

    localStorage.setItem(
      "fixamClient",
      JSON.stringify(client)
    );


    alert(
      "Client account created successfully!\n\n" +
      "Welcome to FixAm Lagos, " + name + "!"
    );


    // Go to login page

    window.location.href = "login.html";

  });

}

// PAYMENT BUTTON

const payNowButton =
  document.getElementById("payNowButton");

if (payNowButton) {

  payNowButton.addEventListener("click", function () {

    // Check if professional is logged in
    const loggedIn =
      localStorage.getItem("fixamLoggedIn");

    const userType =
      localStorage.getItem("fixamUserType");

    if (
      loggedIn !== "true" ||
      userType !== "professional"
    ) {

      alert(
        "Please login as a professional before making payment."
      );

      window.location.href = "login.html";

      return;
    }


    // DEMO PAYMENT FLOW
    const confirmPayment =
      confirm(
        "You are about to pay ₦10,000.\n\n" +
        "Click OK to continue."
      );


    if (!confirmPayment) {
      return;
    }


    // Save payment status
    localStorage.setItem(
      "fixamPaymentCompleted",
      "true"
    );


    alert(
      "Payment completed successfully!\n\n" +
      "You can now post one job."
    );


    // Go to Post Job page
    window.location.href =
      "postjob.html";

  });

}



//  ADMIN DASHBOARD - PENDING JOB

const pendingJobContainer =
  document.getElementById("pendingJobContainer");

const pendingJobCount =
  document.getElementById("pendingJobCount");

const approvedJobCount =
  document.getElementById("approvedJobCount");

const registeredUserCount =
  document.getElementById("registeredUserCount");


// LOAD ADMIN DASHBOARD 

if (pendingJobContainer) {

  // Get pending job
  const savedPendingJob =
    localStorage.getItem("fixamPendingJob");

  // Get approved jobs
  const savedApprovedJobs =
    JSON.parse(
      localStorage.getItem("fixamApprovedJobs")
    ) || [];


  // DASHBOARD COUNTS 

  if (pendingJobCount) {
    pendingJobCount.textContent =
      savedPendingJob ? "1" : "0";
  }


  if (approvedJobCount) {
    approvedJobCount.textContent =
      savedApprovedJobs.length;
  }


  //  DISPLAY PENDING JOB 

  if (savedPendingJob) {

    try {

      const job =
        JSON.parse(savedPendingJob);


      pendingJobContainer.innerHTML = `

        <div class="glass-card p-4">

          <h4 class="fw-bold mb-4">
            ${job.title || "Untitled Job"}
          </h4>


          <div class="row">

            <div class="col-md-6">

              <p>
                <strong>Full Name:</strong>
                ${job.professionalName || "Not provided"}
              </p>

              <p>
                <strong>Occupation:</strong>
                ${job.occupation || "Not provided"}
              </p>

              <p>
                <strong>Type of Work:</strong>
                ${job.workType || "Not provided"}
              </p>

              <p>
                <strong>Gender:</strong>
                ${job.gender || "Not provided"}
              </p>

              <p>
                <strong>Address:</strong>
                ${job.address || "Not provided"}
              </p>

            </div>


            <div class="col-md-6">

              <p>
                <strong>Category:</strong>
                ${job.category || "Not provided"}
              </p>

              <p>
                <strong>Location:</strong>
                ${job.location || "Not provided"}
              </p>

              <p>
                <strong>Preferred Date:</strong>
                ${job.date || "Not provided"}
              </p>

              <p>
                <strong>Start Time:</strong>
                ${job.time || "Not provided"}
              </p>

              <p>
                <strong>Budget:</strong>
                ₦${job.budget || "0"}
              </p>

            </div>

          </div>


          <hr>


          <p>
            <strong>Job Description:</strong>
          </p>

          <p class="text-secondary">
            ${job.description || "No description provided."}
          </p>


          ${
            job.additionalInfo
              ? `
                <p>
                  <strong>Additional Information:</strong>
                </p>

                <p class="text-secondary">
                  ${job.additionalInfo}
                </p>
              `
              : ""
          }


          <p>
            <strong>Payment:</strong>
            ${job.payment || "₦10,000"}
          </p>


          <p>
            <strong>Submitted At:</strong>
            ${job.submittedAt || "Not available"}
          </p>


          <p>
            <strong>Status:</strong>

            <span class="badge bg-warning text-dark">
              Pending
            </span>

          </p>


          <div class="d-flex gap-2 mt-4">

            <button
              type="button"
              class="btn btn-success"
              id="approveJobButton">

              <i class="fa-solid fa-check me-1"></i>
              Approve Job

            </button>


            <button
              type="button"
              class="btn btn-danger"
              id="rejectJobButton">

              <i class="fa-solid fa-xmark me-1"></i>
              Reject Job

            </button>

          </div>

        </div>

      `;

    } catch (error) {

      console.error(
        "Error reading pending job:",
        error
      );

      pendingJobContainer.innerHTML = `

        <div class="text-center py-4">

          <p class="text-danger">
            Unable to load the pending job.
          </p>

        </div>

      `;

    }

  } else {

    //  NO PENDING JOB 

    pendingJobContainer.innerHTML = `

      <div class="text-center py-4">

        <i class="fa-solid fa-inbox fa-3x text-secondary mb-3"></i>

        <p class="text-secondary mb-0">
          No pending jobs at the moment.
        </p>

      </div>

    `;

  }


  //  REGISTERED USERS 

  let userCount = 0;


  if (localStorage.getItem("fixamClient")) {
    userCount++;
  }


  if (localStorage.getItem("fixamProfessional")) {
    userCount++;
  }


  if (registeredUserCount) {
    registeredUserCount.textContent =
      userCount;
  }

}


//  APPROVE JOB 

document.addEventListener("click", function (event) {

  const approveButton =
    event.target.closest("#approveJobButton");


  if (!approveButton) {
    return;
  }


  const savedJob =
    localStorage.getItem("fixamPendingJob");


  if (!savedJob) {

    alert(
      "There is no pending job to approve."
    );

    return;

  }


  try {

    const job =
      JSON.parse(savedJob);


    // Change status
    job.status = "Approved";


    // Get existing approved jobs
    const approvedJobs =
      JSON.parse(
        localStorage.getItem("fixamApprovedJobs")
      ) || [];


    // Add new approved job
    approvedJobs.push(job);


    // Save approved jobs
    localStorage.setItem(
      "fixamApprovedJobs",
      JSON.stringify(approvedJobs)
    );


    // Remove pending job
    localStorage.removeItem(
      "fixamPendingJob"
    );


    alert(
      "Job approved successfully!\n\n" +
      "The job can now appear on FixAm Lagos."
    );


    // Refresh admin dashboard
    window.location.reload();

  } catch (error) {

    console.error(
      "Error approving job:",
      error
    );

    alert(
      "Something went wrong while approving the job."
    );

  }

});


// REJECT JOB 

document.addEventListener("click", function (event) {

  const rejectButton =
    event.target.closest("#rejectJobButton");


  if (!rejectButton) {
    return;
  }


  const savedJob =
    localStorage.getItem("fixamPendingJob");


  if (!savedJob) {

    alert(
      "There is no pending job to reject."
    );

    return;

  }


  const confirmReject =
    confirm(
      "Are you sure you want to reject this job?"
    );


  if (!confirmReject) {
    return;
  }


  // Remove pending job
  localStorage.removeItem(
    "fixamPendingJob"
  );


  alert(
    "Job rejected successfully."
  );


  // Refresh admin dashboard
  window.location.reload();

});


//  SHOW APPROVED JOBS ON FIND PAGE 

const approvedJobsContainer =
  document.getElementById("approvedJobsContainer");


if (approvedJobsContainer) {

  const approvedJobs =
    JSON.parse(
      localStorage.getItem("fixamApprovedJobs")
    ) || [];


  // No approved jobs
  if (approvedJobs.length === 0) {

    approvedJobsContainer.innerHTML = `

      <div class="text-center py-4">

        <i class="fa-solid fa-inbox fa-2x text-secondary mb-3"></i>

        <p class="text-secondary">
          No approved jobs available at the moment.
        </p>

      </div>

    `;

  } else {

    approvedJobsContainer.innerHTML = "";


    approvedJobs.forEach(function (job) {

      approvedJobsContainer.innerHTML += `

        <div class="glass-card p-4 mb-3">

          <h5 class="fw-bold">
            ${job.title || "Untitled Job"}
          </h5>


          <p class="text-secondary mb-2">

            <i class="fa-solid fa-wrench me-1"></i>

            ${job.category || "Service"}

          </p>


          <p class="text-secondary mb-2">

            <i class="fa-solid fa-location-dot me-1"></i>

            ${job.location || "Lagos"}, Lagos

          </p>


          <p class="mb-2">

            <strong>Job Date:</strong>

            ${job.date || "Not specified"}

          </p>


          <p class="mb-2">

            <strong>Job Time:</strong>

            ${job.time || "Not specified"}

          </p>


          <p class="mb-3">

            <strong>Budget:</strong>

            ₦${job.budget || "0"}

          </p>


          <span class="badge bg-success">

            Approved

          </span>

        </div>

      `;

    });

  }

}

// FIND A PROFESSIONAL SEARCH 

const findSearchForm = document.querySelector(".search-box form");
const professionalSearch = document.getElementById("professionalSearch");
const professionalsSection = document.getElementById("professionalsSection");

if (
  findSearchForm &&
  professionalSearch &&
  professionalsSection
) {
  findSearchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const searchValue =
      professionalSearch.value.trim().toLowerCase();

    const professionalCards =
      professionalsSection.querySelectorAll(".glass-card");

    let found = false;

    professionalCards.forEach(function (card) {

      // Don't search the Approved Jobs section
      if (
        card.closest(".mt-5")
      ) {
        return;
      }

      const cardText =
        card.textContent.toLowerCase();

      if (
        searchValue === "" ||
        cardText.includes(searchValue)
      ) {
        card.style.display = "";
        found = true;
      } else {
        card.style.display = "none";
      }
    });

    if (searchValue !== "" && !found) {
      alert("No professional found for this service.");
    }
  });

}


// POST JOB FORM

const postJobForm = document.getElementById("postJobForm");

if (postJobForm) {
  postJobForm.addEventListener("submit", function (event) {
    event.preventDefault();

    // CHECK LOGIN

    const loggedIn =
      localStorage.getItem("fixamLoggedIn");

    const userType =
      localStorage.getItem("fixamUserType");

    if (
      loggedIn !== "true" ||
      userType !== "professional"
    ) {
      alert(
        "Please login as a professional before posting a job."
      );

      window.location.href = "login.html";

      return;
    }

    // CHECK PAYMENT

    const paymentCompleted =
      localStorage.getItem("fixamPaymentCompleted");

    if (paymentCompleted !== "true") {
      alert(
        "A payment of ₦10,000 is required before posting a job."
      );

      window.location.href = "payment.html";

      return;
    }

    // NEW PROFESSIONAL DETAILS

    const professionalName =
      document.getElementById("professionalName").value.trim();

    const professionalOccupation =
      document.getElementById("professionalOccupation").value.trim();

    const professionalWorkType =
      document.getElementById("professionalWorkType").value;

    const professionalGender =
      document.getElementById("professionalGender").value;

    const professionalAddress =
      document.getElementById("professionalAddress").value.trim();

    // EXISTING JOB DETAILS

    const jobTitle =
      document.getElementById("jobTitle").value.trim();

    const jobCategory =
      document.getElementById("jobCategory").value;

    const jobDescription =
      document.getElementById("jobDescription").value.trim();

    const jobLocation =
      document.getElementById("jobLocation").value;

    const jobDate =
      document.getElementById("jobDate").value;

    const jobTime =
      document.getElementById("jobTime").value;

    const jobBudget =
      document.getElementById("jobBudget").value;

    const additionalInfo =
      document.getElementById("additionalInfo").value.trim();

    const jobAgreement =
      document.getElementById("jobAgreement");

    // CHECK REQUIRED FIELDS

    if (
      professionalName === "" ||
      professionalOccupation === "" ||
      professionalWorkType === "" ||
      professionalGender === "" ||
      professionalAddress === "" ||
      jobTitle === "" ||
      jobCategory === "" ||
      jobDescription === "" ||
      jobLocation === "" ||
      jobDate === "" ||
      jobTime === "" ||
      jobBudget === "" ||
      !jobAgreement.checked
    ) {
      alert(
        "Please fill in all required fields and accept the agreement."
      );

      return;
    }

    // CREATE NEW JOB

    const newJob = {
      id: Date.now(),

      professionalName: professionalName,
      occupation: professionalOccupation,
      workType: professionalWorkType,
      gender: professionalGender,
      address: professionalAddress,

      title: jobTitle,
      category: jobCategory,
      description: jobDescription,
      location: jobLocation,
      date: jobDate,
      time: jobTime,
      budget: jobBudget,
      additionalInfo: additionalInfo,

      status: "Pending",
      payment: "₦10,000",
      submittedAt: new Date().toLocaleString("en-NG")
    };

    // GET SAVED JOBS

    let pendingJobs = [];

    try {
      pendingJobs =
        JSON.parse(
          localStorage.getItem("fixamPendingJobs")
        ) || [];
    } catch (error) {
      pendingJobs = [];
    }

    // ADD NEW JOB

    pendingJobs.push(newJob);

    // SAVE ALL JOBS

    localStorage.setItem(
      "fixamPendingJobs",
      JSON.stringify(pendingJobs)
    );

    // SAVE LATEST JOB FOR COMPATIBILITY

    localStorage.setItem(
      "fixamPendingJob",
      JSON.stringify(newJob)
    );

    // PAYMENT HAS BEEN USED

    localStorage.removeItem(
      "fixamPaymentCompleted"
    );

    localStorage.removeItem(
      "fixamPaymentUsed"
    );

    alert(
      "Job submitted successfully!\n\n" +
      "Your job is now pending admin approval."
    );

    // GO TO PROFESSIONAL DASHBOARD

    window.location.href =
      "dashboard-pro.html";
  });
}

// LOGOUT

const logoutButton =
  document.getElementById("logoutButton");

if (logoutButton) {
  logoutButton.addEventListener("click", function (event) {
    event.preventDefault();

    localStorage.removeItem("fixamLoggedIn");
    localStorage.removeItem("fixamUserType");

    window.location.href = "login.html";
  });
}