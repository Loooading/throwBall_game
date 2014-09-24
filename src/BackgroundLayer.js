/**
 * Created by liuhujun on 14-9-3.
 */
var BackgroundLayer = cc.Layer.extend({
    space:null,
    ctor:function(space){
        this._super();
        this.space = space;
        this.init();
    },

    init:function(){
        this._super();
        this.schedule(this.addObstacle, 1, 10000000, 0.1);

    },

    addObstacle:function()
    {
        var winSize = cc.director.getWinSize();
        var sprite = cc.PhysicsSprite.create(res.Obstacle_png);
        var body = new cp.StaticBody();
        var randX = Math.random() * winSize.width;
        body.setPos(cc.p(randX, -50));
        sprite.setBody(body);
        var shape = new cp.BoxShape(body, sprite.getContentSize().width, sprite.getContentSize().height+20);
        //shape.setCollisionType(0);
        shape.setElasticity(2);
        shape.setFriction(2);
        this.space.addStaticShape(shape);
        this.addChild(sprite);
        var actionMoveBy = cc.moveBy(10,cc.p(0,winSize.height));
        var funcCallBack = cc.callFunc(this.removeFromBgLayer,this);
        var action = cc.sequence(actionMoveBy,funcCallBack);
        sprite.runAction(action);
    },

    removeFromBgLayer:function (sprite) {
        var shape = sprite.getBody().shapeList[0];
        this.space.removeStaticShape(shape);
        shape = null;
        sprite.removeFromParent(sprite);
        sprite = null;
        cc.log("removeFromBgLayer");
    }
})