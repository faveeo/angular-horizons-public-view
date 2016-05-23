# angular-horizons-public-view
Angular modules to display Horizons public content

## Install with bower

``` bower install faveeo/angular-horizons-public-view --save ```

## External requirements

#### CSS files

The directive need the following CSS to be displayed correctly

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" crossorigin="anonymous">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css">

#### Jquery

To do the sharing of articles we use the addthis toolbox that require JQuery to be installed.
Add:  
``` <script type="text/javascript" src="//code.jquery.com/jquery-1.11.3.min.js"></script> ```


## Angular requirements

- Add a dependency of your app to the **angularHorizonsPublicView** module.

- Copy the _shareIcons_ folder from the _assets_ folder into your own project _assets_ folder. They contain the icons displayed when sharing an article.

- Initialize the FaveeoApiConfig url and the assets path:
```
    .controller('MainController', function($rootScope, FaveeoApiConfig) {
		$rootScope.assetsPath = 'assets';
		FaveeoApiConfig.init('https://again.faveeo.com');
	});
```

- Add the "simpleView" directive to display the list of articles:
```
    <simpleview config="{
        socialMagazineId: SOCIAL_MAGAZINE_ID,
        dateRange: 7,
        pageSize: 10,
        showImages: true
    }">
    </simpleview>
```
