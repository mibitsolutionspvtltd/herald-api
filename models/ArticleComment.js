module.exports = (sequelize, DataTypes) => {
    const ArticleComment = sequelize.define(
        'ArticleComment',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            article_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: 'article',
                    key: 'id',
                },
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'operator', // comments often linked to users, here using operator
                    key: 'id',
                },
            },
            parent_comment_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: 'article_comments',
                    key: 'id',
                },
            },
            author_name: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            author_email: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            content: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            comment_status_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue: 1,
                references: {
                    model: 'comment_status_type',
                    key: 'id',
                },
            },
            ip_address: {
                type: DataTypes.STRING(45),
                allowNull: true,
            },
            user_agent: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            created_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            tableName: 'article_comments',
            timestamps: false,
        }
    );

    ArticleComment.associate = (models) => {
        ArticleComment.belongsTo(models.Article, {
            foreignKey: 'article_id',
            as: 'article',
        });
        ArticleComment.belongsTo(models.Operator, {
            foreignKey: 'user_id',
            as: 'user',
        });
        ArticleComment.belongsTo(models.CommentStatusType, {
            foreignKey: 'comment_status_id',
            as: 'status',
        });
        ArticleComment.belongsTo(models.ArticleComment, {
            foreignKey: 'parent_comment_id',
            as: 'parent',
        });
        ArticleComment.hasMany(models.ArticleComment, {
            foreignKey: 'parent_comment_id',
            as: 'replies',
        });
    };

    return ArticleComment;
};
