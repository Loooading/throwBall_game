/**
 * Created by liuhujun on 14-9-3.
 */

if(typeof SpriteTag == "undefined") {
    var SpriteTag = {};
    SpriteTag.ball = 0;
    SpriteTag.bottom = 1;
    SpriteTag.top = 2;
};

var PlayScene = cc.Scene.extend({
    space:null,
    bgLayer:null,
    ballLayer:null,
    ballShape:null,
    onEnter:function () {
        this._super();

        this.initPhysics();
        this.setupDebugNode();
        //add three layer in the right order
        this.bgLayer = new BackgroundLayer(this.space)
        this.addChild(this.bgLayer);
        this.ballLayer = new BallSpriteLayer(this.space)
        this.ballShape  = this.ballLayer.shape;
        this.addChild(this.ballLayer);
        this.addChild(new StatusLayer());
        this.scheduleUpdate();
    },

    initPhysics:function() {


        var winSize = cc.director.getWinSize();
        //1. new space object
        this.space = new cp.Space();
        //2. setup the  Gravity
        this.space.gravity = cp.v(0, -100);
        var staticBody = this.space.staticBody;
        var walls = [ new cp.SegmentShape( staticBody, cp.v(0,0), cp.v(0,winSize.height), 0),                // left
                      new cp.SegmentShape( staticBody, cp.v(winSize.width,0), cp.v(winSize.width,winSize.height), 0),   // right
                      new cp.SegmentShape( staticBody, cp.v(0, 0), cp.v(winSize.width, 0), 0)    // bottom

        ];

        for( var i=0; i < walls.length; i++ ) {
            var shape = walls[i];
            shape.setElasticity(1);
            shape.setFriction(1);
            this.space.addStaticShape( shape );
        }

        this.space.addCollisionHandler(SpriteTag.ball, SpriteTag.top,
            this.collisionTopBegin.bind(this), null, null, null);
//        this.space.addCollisionHandler(SpriteTag.runner, SpriteTag.rock,
//            this.collisionRockBegin.bind(this), null, null, null);
    },

    collisionTopBegin:function(){
        cc.log("collisionTopBegin");
    },

    update:function (dt) {
        // chipmunk step
        this.space.step(dt);
        for(var i = 0; i<= 100; i++)
        {
            this.space.reindexStatic();
        }
//        this.space.reindexShape(this.ballShape);
    },

    setupDebugNode:function()
    {
        // debug only
        this._debugNode = cc.PhysicsDebugNode.create( this.space );
        this._debugNode.visible = true ;
        this.addChild( this._debugNode );
    }
});